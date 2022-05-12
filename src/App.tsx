import { lazy, Suspense } from 'react';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import TodoList from './components/TodoList/TodoList';

const ContentSlider = lazy(() => import('./components/Slider/ContentSlider'));

export default function App() {
  return (
    <>
      <header className='nav-panel'>
        <nav>
          <ul>
            <li>
              <Link to='/todo-list'>Todo List</Link>
            </li>
            <li>
              <Link to='/slider-gallery'>Gallery Slider</Link>
            </li>
          </ul>
        </nav>
      </header>
      <Routes>
        <Route path='/' element={<PageLayout />}>
          <Route index element={<TodoList />} />
          <Route path='todo-list' element={<TodoList />} />
          <Route
            path='slider-gallery'
            element={
              <Suspense fallback={<>Loading....</>}>
                <h1>In Progress...</h1>
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

const PageLayout = () => {
  return (
    <>
      <main className='App'>
        <Outlet />
      </main>
    </>
  );
};
