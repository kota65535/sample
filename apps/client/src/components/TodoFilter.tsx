import { Radio, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';

type TodoFilterProps = {
  hasCompleted: boolean
}

const TodoFilter = (props: TodoFilterProps) => {
  const location = useLocation();
  const currentFilter = location.pathname.split('/').pop() || 'all';

  return (
    <div className="todo-filter-container">
      <Radio.Group value={currentFilter} buttonStyle="solid">
        <Radio.Button value="all">
          <Link to="/">All</Link>
        </Radio.Button>
        <Radio.Button value="active">
          <Link to="/active">Active</Link>
        </Radio.Button>
        <Radio.Button value="completed">
          <Link to="/completed">Completed</Link>
        </Radio.Button>
      </Radio.Group>
      
      {props.hasCompleted && (
        <Button 
          onClick={() => "should delete completed"}
          className="todo-filter-clear"
          danger
        >
          Clear completed
        </Button>
      )}
    </div>
  );
};

export default TodoFilter;