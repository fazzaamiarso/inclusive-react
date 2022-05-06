import React, {
  FormEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  { src: '../assets/img1.jpg', alt: '3 Golden coins' },
  { src: '../assets/img2.jpg', alt: 'A person holding camera' },
  { src: '../assets/img3.jpg', alt: 'A bowl of soup' },
  { src: '../assets/img4.jpg', alt: 'Street in the past' },
  {
    src: '../assets/img5.jpg',
    alt: 'A planning table with a laptop, a sketch, and colored markers',
  },
];
const ContentSlider = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const galleryRef = useRef<HTMLElement>(null);

  const handleNext = () => {
    if (galleryRef.current === null) return;
    if (
      currentSlideIdx ===
      galleryRef.current.querySelectorAll('li').length - 1
    )
      return;
    galleryRef.current
      .querySelectorAll('li')
      [currentSlideIdx + 1].scrollIntoView({ behavior: 'smooth' });
    setCurrentSlideIdx((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (galleryRef.current === null) return;
    if (currentSlideIdx === 0) return;
    galleryRef.current
      .querySelectorAll('li')
      [currentSlideIdx - 1].scrollIntoView({ behavior: 'smooth' });
    setCurrentSlideIdx((prev) => prev - 1);
  };

  return (
    <div className='gallery-container'>
      <ul className='gallery-control' aria-label='gallery controls'>
        <li>
          <button
            type='button'
            aria-label='previous image'
            className='prev'
            onClick={handlePrev}
          >
            <svg
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              height='4rem'
              width='4rem'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </li>
        <li>
          <button
            type='button'
            aria-label='next image'
            className='next'
            onClick={handleNext}
          >
            <svg
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              height='4rem'
              width='4rem'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </li>
      </ul>
      <section
        aria-labelledby='slider-gallery'
        aria-describedby='instruction'
        tabIndex={0}
        className='gallery'
        id='gallery'
        ref={galleryRef}
      >
        <span id='slider-gallery' className='sr-only'>
          Gallery
        </span>
        <ul className='list'>
          {IMAGES.map((image, idx) => {
            return (
              <SliderItem
                key={image.src}
                imgSrc={image.src}
                alt={image.alt}
                slideIdx={idx}
                setCurrentSlideIdx={setCurrentSlideIdx}
              />
            );
          })}
        </ul>
      </section>
      <div className='instruction'>
        <span aria-hidden='true'>⬅</span>
        <span id='instruction'>scroll for more</span>
        <span aria-hidden='true'>➡</span>
      </div>
    </div>
  );
};

type SliderItemProps = {
  imgSrc: string;
  alt: string;
  slideIdx: number;
  setCurrentSlideIdx: (idx: number) => void;
};
const SliderItem = ({
  imgSrc,
  alt,
  slideIdx,
  setCurrentSlideIdx,
}: SliderItemProps) => {
  const sliderRef = useRef<HTMLLIElement>(null);
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!sliderRef.current) return;
    if ('IntersectionObserver' in window) {
      const intersectionObserverOptions: {
        root: IntersectionObserver['root'];
      } = {
        root: document.getElementById('gallery'),
      };
      const intersectionCallback: IntersectionObserverCallback = (slides) => {
        slides.forEach((slide) => {
          if (image || !slide.isIntersecting) return;
          setImage(imgSrc);
        });
        slides.forEach((slide) => {
          if (slide.intersectionRatio === 1) {
            setCurrentSlideIdx(slideIdx);
          }
        });
      };
      const observer = new IntersectionObserver(
        intersectionCallback,
        intersectionObserverOptions
      );
      observer.observe(sliderRef.current);
    } else {
      setImage(imgSrc);
    }
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
