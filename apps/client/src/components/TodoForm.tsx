import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {useCreateTodo} from "../hooks/todo.ts";

const TodoForm: React.FC = () => {
  const [form] = Form.useForm();
  const { trigger: createTodo } = useCreateTodo();
  const [loading, setLoading] = useState(false);

  const handleSubmit = ({ title }: { title: string }) => {
    if (!title.trim()) return;
    
    setLoading(true);
    createTodo({
      title
    });
    form.resetFields();
    setLoading(false);
  };

  return (
    <div className="todo-form-container">
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="inline"
        className="todo-form"
      >
        <Form.Item
          name="title"
          className="todo-form-input"
          rules={[{ required: true, message: 'Please enter a task' }]}
        >
          <Input 
            placeholder="What needs to be done?" 
            size="large"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<PlusOutlined />} 
            size="large"
            loading={loading}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TodoForm;