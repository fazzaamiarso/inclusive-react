import { FormEvent, useEffect, useRef, useState } from 'react';
import { ThemeMode } from '.';
import './App.css';
import DarkModeSwitch from './components/DarkModeSwitch';

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

  return (
    <div className='App'>
      <section aria-labelledby='todo-heading' className='todo-section'>
        <h1 id='todo-heading' tabIndex={-1}>
          My Accessible Todo List
        </h1>
        <ul
          className='controls'
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <li>
            <ToggleButton
              shouldShow={shouldShow}
              setShouldShow={setShouldShow}
            />
          </li>
          <li>
            <DarkModeSwitch mode={mode} setMode={setMode} />
          </li>
        </ul>
        {filteredTodos.length ? (
          <ul>
            {filteredTodos.map((todo) => (
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

type ToggleProps = {
  shouldShow: boolean;
  setShouldShow: (value: boolean) => void;
};
const ToggleButton = ({ shouldShow, setShouldShow }: ToggleProps) => {
  return (
    <button
      type='button'
      onClick={() => setShouldShow(!shouldShow)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '.5rem',
        width: 'max-content',
      }}
      aria-label={shouldShow ? 'Hide completed' : 'Show completed'}
    >
      {shouldShow ? (
        <svg
          aria-hidden='true'
          height='1.25rem'
          xmlns='http://www.w3.org
          /2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
          />
        </svg>
      ) : (
        <svg
          aria-hidden='true'
          height='1.25rem'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
          />
        </svg>
      )}
      {shouldShow ? 'Hide completed' : 'Show completed'}
    </button>
  );
};

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
        delete <span className='sr-only'>{todo.name}</span>
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
