import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import TodoList from './pages/TodoList';
import { TodoProvider } from './context/TodoContext';
import './App.less';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TodoList />,
  },
  {
    path: '/:filter',
    element: <TodoList />,
  }
]);

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <TodoProvider>
        <div className="app-container">
          <RouterProvider router={router} />
        </div>
      </TodoProvider>
    </ConfigProvider>
  );
}

export default App;