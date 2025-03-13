import React from 'react';
import {Checkbox, Button, Typography, List} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {Todo} from '../types/todo';
import {useDeleteTodo, useUpdateTodo} from "../hooks/todo.ts";

const {Text} = Typography;

interface TodoItemProps {
    todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({todo}) => {
    const {trigger: deleteTodo} = useDeleteTodo(todo.id)
    const {trigger: updateTodo} = useUpdateTodo(todo.id)

    return (
        <List.Item
            className="todo-item"
            actions={[
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTodo()}
                    aria-label="Delete todo"
                />
            ]}
        >
            <div className="flex items-center w-full">
                <Checkbox
                    checked={todo.completed}
                    onChange={() => updateTodo({
                        ...todo,
                        completed: !todo.completed
                    })}
                    className="mr-3"
                />
                <Text
                    style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#999' : 'inherit',
                        width: '100%'
                    }}
                >
                    {todo.title}
                </Text>
            </div>
        </List.Item>
    );
};

export default TodoItem;