import React, { useState } from 'react';
import { Card, Typography, Empty, Table, Tag, TableColumnType } from 'antd';
import { useParams } from 'react-router-dom';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import TodoForm from '../components/TodoForm';
import TodoFilter from '../components/TodoFilter';
import { useTodo } from '../context/TodoContext';
import { Todo } from '../types/todo';

const { Title } = Typography;

const TodoList: React.FC = () => {
  const { filter = 'all' } = useParams<{ filter?: string }>();
  const { todos, activeTodos, completedTodos, toggleTodo, deleteTodo } = useTodo();
  const [pageSize, setPageSize] = useState<number>(5);

  const filteredTodos = {
    all: todos,
    active: activeTodos,
    completed: completedTodos
  }[filter] || todos;

  const columns: TableColumnType<Todo>[] = [
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'status',
      width: 100,
      render: (completed: boolean) => (
        <Tag color={completed ? 'success' : 'processing'}>
          {completed ? 'Completed' : 'Active'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: false },
        { text: 'Completed', value: true },
      ],
      onFilter: (value: boolean | React.Key, record: Todo) => record.completed === value,
    },
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Todo) => (
        <span style={{
          textDecoration: record.completed ? 'line-through' : 'none',
          color: record.completed ? '#999' : 'inherit'
        }}>
          {text}
        </span>
      ),
      sorter: (a: Todo, b: Todo) => a.title.localeCompare(b.title),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleString(),
      sorter: (a: Todo, b: Todo) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      responsive: ['md'],
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Todo) => (
        <div className="todo-actions">
          <a
            onClick={() => toggleTodo(record.id)}
            className="todo-action-button"
          >
            <CheckOutlined className={record.completed ? "todo-completed-icon" : "todo-active-icon"} />
          </a>
          <a
            onClick={() => deleteTodo(record.id)}
            className="todo-action-button"
          >
            <DeleteOutlined className="todo-delete-icon" />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="todo-container">
      <Card className="todo-card">
        <Title level={2} className="todo-title">
          Todo App
        </Title>

        <TodoForm />

        <div className="todo-table-container">
          <Table
            dataSource={filteredTodos}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: pageSize,
              pageSizeOptions: ['5', '10', '20'],
              showSizeChanger: true,
              onChange: (_, size) => setPageSize(size),
            }}
            locale={{ emptyText: <Empty description="No todos found" /> }}
            size="middle"
          />
        </div>

        <TodoFilter />

        <div className="todo-counter">
          <Typography.Text type="secondary">
            {activeTodos.length} {activeTodos.length === 1 ? 'item' : 'items'} left
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default TodoList;