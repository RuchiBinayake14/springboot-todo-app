import React, { useState } from 'react';
import axios from 'axios';

const AddTodo = ({ onAdd }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/todos/todo', { content })
      .then(response => {
        onAdd(response.data);  // pass new todo to parent
        setContent("");        // reset input
      })
      .catch(error => console.log(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        placeholder="Enter todo"
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">➕ Add Todo</button>
    </form>
  );
};

export default AddTodo;
