import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  // Fetch todos when component loads
  useEffect(() => {
    axios.get('http://localhost:8080/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.log(error));
  }, []);

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:8080/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.content} 
            <button onClick={() => deleteTodo(todo.id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
