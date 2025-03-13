import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {ConfigProvider, theme} from 'antd';
import TodoList from './pages/TodoList';
import './App.less';
import {EnvProvider} from "./env/provider.tsx";
import {ApiClientProvider} from "./apis/provider.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <TodoList/>,
    },
    {
        path: '/:filter',
        element: <TodoList/>,
    }
]);

function App() {
    return (
        <EnvProvider>
            <ApiClientProvider>
                <ConfigProvider
                    theme={{
                        algorithm: theme.defaultAlgorithm,
                        token: {
                            colorPrimary: '#1677ff',
                            borderRadius: 6,
                        },
                    }}
                >
                    <div className="app-container">
                        <RouterProvider router={router}/>
                    </div>
                </ConfigProvider>
            </ApiClientProvider>
        </EnvProvider>
    );
}

export default App;