import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Todo } from '../types/todo';
import { todoApi } from '../api/todoApi';

interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  activeTodos: Todo[];
  completedTodos: Todo[];
  isLoading: boolean;
  error: string | null;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const data = await todoApi.getAllTodos();
        setTodos(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch todos');
        console.error('Error fetching todos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (title: string) => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const newTodo = await todoApi.createTodo(title);
      setTodos([...todos, newTodo]);
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    setIsLoading(true);
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const updatedTodo = await todoApi.updateTodo(id, {
        completed: !todoToUpdate.completed
      });

      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setIsLoading(true);
    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCompleted = async () => {
    setIsLoading(true);
    try {
      await todoApi.deleteCompletedTodos();
      setTodos(todos.filter(todo => !todo.completed));
      setError(null);
    } catch (err) {
      setError('Failed to clear completed todos');
      console.error('Error clearing completed todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        clearCompleted,
        activeTodos,
        completedTodos,
        isLoading,
        error
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};