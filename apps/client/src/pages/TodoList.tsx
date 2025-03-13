import React, {useState} from 'react';
import {Card, Typography, Empty, Table, Tag, TableColumnType} from 'antd';
import {useParams} from 'react-router-dom';
import {CheckOutlined, DeleteOutlined} from '@ant-design/icons';
import TodoForm from '../components/TodoForm';
import TodoFilter from '../components/TodoFilter';
import {GetTodoResponse, useGetTodos, useUpdateTodo} from "../hooks/todo.ts";
import {deleteTodo} from "@sample/server/src/db.ts";

const {Title} = Typography;

const TodoList: React.FC = () => {
    const {filter = 'all'} = useParams<{ filter?: string }>();
    const {data, error, isLoading} = useGetTodos()
    const {trigger} = useUpdateTodo("1")
    const [pageSize, setPageSize] = useState<number>(5);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    const allTodos = data!.todos
    const activeTodos = allTodos.filter(t => !t.completed)
    const completedTodos = allTodos.filter(t => t.completed)

    const filteredTodos = {
        all: allTodos,
        active: activeTodos,
        completed: completedTodos
    }[filter];

    const columns: TableColumnType<GetTodoResponse>[] = [
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
                {text: 'Active', value: false},
                {text: 'Completed', value: true},
            ],
            onFilter: (value: boolean | React.Key, record: GetTodoResponse) => record.completed === value,
        },
        {
            title: 'Task',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: GetTodoResponse) => (
                <span style={{
                    textDecoration: record.completed ? 'line-through' : 'none',
                    color: record.completed ? '#999' : 'inherit'
                }}>
          {text}
        </span>
            ),
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: Date) => new Date(date).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            responsive: ['md'],
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, record) => (
                <div className="todo-actions">
                    <a
                        onClick={() => {
                            trigger({
                                ...record,
                                completed: !record.completed
                            })
                        }}
                        className="todo-action-button"
                    >
                        <CheckOutlined className={record.completed ? "todo-completed-icon" : "todo-active-icon"}/>
                    </a>
                    <a
                        onClick={() => deleteTodo(record.id)}
                        className="todo-action-button"
                    >
                        <DeleteOutlined className="todo-delete-icon"/>
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

                <TodoForm/>

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
                        locale={{emptyText: <Empty description="No todos found"/>}}
                        size="middle"
                    />
                </div>

                <TodoFilter hasCompleted={completedTodos.length > 0}/>

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