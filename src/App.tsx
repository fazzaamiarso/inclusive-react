import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import ContentSlider from './components/Slider/ContentSlider';
import TodoList from './components/TodoList/TodoList';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<PageLayout />}>
        <Route index element={<TodoList />} />
        <Route path='slider-gallery' element={<ContentSlider />} />
      </Route>
    </Routes>
  );
}

const PageLayout = () => {
  return (
    <main className='App'>
      <Outlet />
    </main>
  );
};
