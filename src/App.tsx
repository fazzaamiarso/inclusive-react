import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <main className='App'>
      <ContentSlider />
    </main>
  );
}

const ContentSlider = () => {
  useEffect(() => {
    //add touch class to indicate that it's a touch device
    const addTouchClass = () => {
      document.body.classList.add('touch');
      document.removeEventListener('touchstart', addTouchClass);
    };
    document.addEventListener('touchstart', addTouchClass);
  }, []);

  return (
    <section aria-labelledby='slider-gallery' tabIndex={0} className='gallery'>
      <span id='slider-gallery' className='sr-only'>
        Gallery
      </span>
      <ul className='list'>
        <li className='item'></li>
        <li className='item'></li>
        <li className='item'></li>
        <li className='item'></li>
        <li className='item'></li>
      </ul>
      <div className='instruction'>
        <span aria-hidden='true'>⬅</span>
        <span>scroll for more</span>
        <span aria-hidden='true'>➡</span>
      </div>
    </section>
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
