import {
  useState,
  useRef,
  useEffect,
  FormEvent,
  ChangeEvent,
  Reducer,
  useReducer,
} from 'react';
import { ThemeMode } from '..';
import DarkModeSwitch from './DarkModeSwitch';
import ToggleButton from './ToggleButton';
import style from './TodoList.module.css';

const TODO_SEED = [
  { id: '1', name: 'Learn Remix', completed: false },
  { id: '2', name: 'Get groceries', completed: true },
];

type TodoItem = { id: string; name: string; completed: boolean };
type TaskActions =
  | { type: 'create'; payload: TodoItem }
  | { type: 'delete' | 'toggle'; payload: TodoItem['id'] };

type TaskReducerState = {
  todos: TodoItem[];
  action: TaskActions['type'] | null;
};

const todoReducer: Reducer<TaskReducerState, TaskActions> = (state, action) => {
  switch (action.type) {
    case 'create':
      return { todos: [...state.todos, action.payload], action: 'create' };
    case 'delete':
      return {
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        action: 'delete',
      };
    case 'toggle':
      const updatedTodos = state.todos.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return { todos: updatedTodos, action: 'toggle' };
    default:
      throw Error(`Unhandled action`);
  }
};

export default function TodoList() {
  const [{ todos, action }, dispatch] = useReducer(todoReducer, {
    todos: TODO_SEED,
    action: null,
  });
  const [todoInput, setTodoInput] = useState('');
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
  }, [action, todos]);

  const createTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo = {
      id: String(Date.now()),
      name: todoInput,
      completed: false,
    };
    dispatch({ type: 'create', payload: newTodo });
    setTodoInput('');
    if (liveRegionRef.current)
      liveRegionRef.current.textContent = `added ${todoInput}`;
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'delete', payload: id });
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: 'toggle', payload: id });
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
        <span className='sr-only'>delete {name}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1.5rem'
          width='1.5rem'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </li>
  );
};
