import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { ThemeMode } from '..';
import DarkModeSwitch from './DarkModeSwitch';
import ToggleButton from './ToggleButton';
import style from './TodoList.module.css';

const TODO_SEED = [
  { id: '1', name: 'Learn Remix', completed: false },
  { id: '2', name: 'Get groceries', completed: true },
];

type TaskAction = 'create' | 'delete';
export default function TodoList() {
  const [todos, setTodos] = useState(TODO_SEED);
  const [todoInput, setTodoInput] = useState('');
  const [action, setAction] = useState<TaskAction | null>(null);
  const liveRegionRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [shouldShow, setShouldShow] = useState(true);
  const filteredTodos = shouldShow
    ? todos
    : todos.filter((todo) => todo.completed === false);

  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    if (action === 'create' && todos.length) {
      inputRef.current?.focus();
    }

    if (action === 'delete') {
      if (todos.length === 0) {
        const heading = document.getElementById(
          'todo-heading'
        ) as HTMLHeadingElement;
        heading.focus();
      } else {
        const firstTodoItem = document.querySelector('ul input') as HTMLElement;
        if (firstTodoItem) firstTodoItem.focus();
      }
    }
    setAction(null);
  }, [action, todos]);

  const createTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo = {
      id: String(Date.now()),
      name: todoInput,
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setTodoInput('');
    if (liveRegionRef.current)
      liveRegionRef.current.textContent = `added ${todoInput}`;
  };

  const deleteTodo = (id: string) => {
    setAction('delete');
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return updatedTodos;
    });
  };

  return (
    <section
      aria-labelledby='todo-heading'
      className={`${style.section} ${mode === 'dark' ? style.dark : ''} `}
    >
      <h1 id='todo-heading' tabIndex={-1} style={{ fontSize: '1.5rem' }}>
        My Accessible Todo List
      </h1>
      <ul className={style.controls}>
        <li>
          <ToggleButton shouldShow={shouldShow} setShouldShow={setShouldShow} />
        </li>
        <li>
          <DarkModeSwitch mode={mode} setMode={setMode} />
        </li>
      </ul>
      {filteredTodos.length ? (
        <ul className={style.todos}>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              name={todo.name}
              completed={todo.completed}
              deleteTodo={deleteTodo}
              toggleTodo={toggleTodo}
            />
          ))}
        </ul>
      ) : (
        <div
          style={{ width: '100%', paddingTop: '1rem', paddingBottom: '2rem' }}
        >
          <p className={style.emptyTodo}>
            <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              No todo yet
            </span>{' '}
            <span>add your first todo ⬇</span>
          </p>
        </div>
      )}
      <form onSubmit={createTodo} className={style.form}>
        <span
          className='sr-only'
          role='status'
          aria-live='polite'
          id='add-status'
          ref={liveRegionRef}
        />
        <input
          type='text'
          placeholder='e.g. watch family feud'
          required
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          ref={inputRef}
          id='add-task'
        />
        <label htmlFor='add-task' className='sr-only'>
          Add todo
        </label>
        <button type='submit'>add todo</button>
      </form>
    </section>
  );
}

type TodoItemProps = {
  id: string;
  name: string;
  completed: boolean;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
};
const TodoItem = ({
  id,
  name,
  completed,
  deleteTodo,
  toggleTodo,
}: TodoItemProps) => {
  const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
    toggleTodo(id);
  };

  return (
    <li>
      <input
        type='checkbox'
        id={id}
        defaultChecked={completed}
        onChange={handleToggle}
      />
      <label htmlFor={id} style={{ width: '100%' }}>
        {name}
      </label>
      <button
        type='button'
        onClick={() => deleteTodo(id)}
        className={style.delete}
      >
        delete <span className='sr-only'>{name}</span>
      </button>
    </li>
  );
};
