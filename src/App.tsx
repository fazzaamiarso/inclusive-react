import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className='App'>
      <TodoList />
    </div>
  );
}
export default App;

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
