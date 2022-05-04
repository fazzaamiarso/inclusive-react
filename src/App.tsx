import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import './App.css';

const TODO_SEED = [
  { id: '1', name: 'Learn Remix', completed: false },
  { id: '2', name: 'Get groceries', completed: true },
];

type TaskAction = 'create' | 'delete';

function App() {
  const [todos, setTodos] = useState(TODO_SEED);
  const [todoInput, setTodoInput] = useState('');
  const [action, setAction] = useState<TaskAction | null>(null);
  const liveRegionRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className='App'>
      <section aria-labelledby='todo-heading' className='todo-section'>
        <h1 id='todo-heading' tabIndex={-1}>
          My Accessible Todo List
        </h1>
        {todos.length ? (
          <ul>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
            ))}
          </ul>
        ) : (
          <p
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            No todo yet <span>add your first todo</span>
          </p>
        )}
        <form onSubmit={createTodo}>
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
            aria-labelledby='add-task'
          />
          <span id='add-task' className='sr-only'>
            Add task
          </span>
          <button type='submit'>Add task</button>
        </form>
      </section>
    </div>
  );
}
export default App;

type TodoItemProps = {
  todo: {
    id: string;
    name: string;
    completed: boolean;
  };
  deleteTodo: (id: string) => void;
};
const TodoItem = ({ todo, deleteTodo }: TodoItemProps) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  return (
    <li>
      <input
        type='checkbox'
        id={todo.id}
        checked={isCompleted}
        onChange={() => setIsCompleted(!isCompleted)}
      />
      <label htmlFor={todo.id}>{todo.name}</label>
      <button
        type='button'
        className='delete-btn'
        onClick={() => deleteTodo(todo.id)}
      >
        delete
      </button>
    </li>
  );
};

const QuickAccordion = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className='accordion'>
      <details onToggle={() => setOpen(!open)}>
        <summary>
          The greatest 4th Gen boyband{' '}
          <span className='summary-widget'>{open ? '-' : '+'}</span>
        </summary>
        <p>
          TXT gained a lot of popularity lately as a 4th generation group. Their
          clean and neat choreo, combined with exquisite vocals. Amazing
        </p>
      </details>
    </section>
  );
};
