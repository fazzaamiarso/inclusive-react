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

const IMAGES = [
  { src: '../assets/img1.jpg', alt: '' },
  { src: '../assets/img2.jpg', alt: '' },
  { src: '../assets/img3.jpg', alt: '' },
  { src: '../assets/img4.jpg', alt: '' },
  { src: '../assets/img5.jpg', alt: '' },
];
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
    <>
      <section
        aria-labelledby='slider-gallery'
        aria-describedby='instruction'
        tabIndex={0}
        className='gallery'
        id='gallery'
      >
        <span id='slider-gallery' className='sr-only'>
          Gallery
        </span>
        <ul className='list'>
          {IMAGES.map((image) => {
            return (
              <SliderItem key={image.src} imgSrc={image.src} alt={image.alt} />
            );
          })}
        </ul>
      </section>
      <div className='instruction'>
        <span aria-hidden='true'>⬅</span>
        <span id='instruction'>scroll for more</span>
        <span aria-hidden='true'>➡</span>
      </div>
    </>
  );
};

type SliderItemProps = {
  imgSrc: string;
  alt: string;
};
const SliderItem = ({ imgSrc, alt }: SliderItemProps) => {
  const sliderRef = useRef<HTMLLIElement>(null);
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!sliderRef.current || !('IntersectionObserver' in window)) return;
    const intersectionObserverOptions: { root: IntersectionObserver['root'] } =
      {
        root: document.getElementById('gallery'),
      };
    const intersectionCallback: IntersectionObserverCallback = (
      slides,
      observer
    ) => {
      slides.forEach((slide) => {
        if (!slide.isIntersecting) return;
        setImage(imgSrc);
        observer.unobserve(slide.target);
      });
    };
    const observer = new IntersectionObserver(
      intersectionCallback,
      intersectionObserverOptions
    );
    observer.observe(sliderRef.current);
  }, []);
  return (
    <li className='item' ref={sliderRef}>
      <figure>
        <img src={image} alt={alt} />
      </figure>
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
