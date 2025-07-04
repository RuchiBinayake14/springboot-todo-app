import React, { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);
  const [pendingToday, setPendingToday] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:8080/todos")
      .then((res) => {
        setTodos(res.data);

        const currentHour = new Date().getHours();
        if (currentHour >= 19) {
          handleSummary(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const today = new Date().toDateString();

  const handleSummary = (data) => {
    const todayTodos = data.filter(todo =>
      new Date(todo.createdAt).toDateString() === today
    );
    const completed = todayTodos.filter(todo => todo.completed).length;
    const pending = todayTodos.filter(todo => !todo.completed).length;

    if (completed + pending > 0) {
      setCompletedToday(completed);
      setPendingToday(pending);
      setShowSummary(true);
      sendSummaryEmail(completed, pending); // ✅ Send Email
    }
  };

  const sendSummaryEmail = (completed, pending) => {
    const templateParams = {
      completed,
      pending
    };

    emailjs.send(
      "service_0mwqze6",      // 🔁 Replace with your EmailJS service ID
      "template_h4qs1ji",     // 🔁 Replace with your EmailJS template ID
      templateParams,
      "I6q6zKcJ0QF7wm9o6"       // 🔁 Replace with your EmailJS public key
    ).then((res) => {
      console.log("✅ Summary Email Sent!", res);
    }).catch((err) => {
      console.error("❌ Error sending email:", err);
    });
  };

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    axios.post("http://localhost:8080/todos", {
      content: newTodo,
      completed: false,
    }).then((res) => {
      setTodos([...todos, res.data]);
      setNewTodo("");
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/todos/${id}`).then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    });
  };

  const handleDeleteAll = () => {
    axios.delete("http://localhost:8080/todos/all").then(() => {
      setTodos([]);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const toggleCompleted = (todo) => {
    axios.put(`http://localhost:8080/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    }).then((res) => {
      setTodos(todos.map((t) =>
        t.id === todo.id ? { ...t, completed: res.data.completed } : t
      ));
    });
  };

  return (
    <div className={`container mt-4 ${isDarkMode ? "dark-mode" : ""}`} style={{ maxWidth: "600px" }}>

      {/* 🌗 Dark Mode Toggle */}
      <div className="text-end mb-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Theme"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <h1 className="text-center mb-4">📋 My Todo App</h1>

      {/* ✅ Summary Modal */}
      {showSummary && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <h5 className="modal-title mb-3">🔔 Today’s Summary</h5>
              <p>✅ You completed {completedToday} tasks today!</p>
              <p>❌ {pendingToday} tasks are still pending.</p>
              <button className="btn btn-primary mt-3" onClick={() => setShowSummary(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Input Field and Add Button */}
      <div className="mb-3">
        <input
          type="text"
          value={newTodo}
          className="form-control"
          placeholder="Enter your task"
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="d-grid mt-2">
          <button className="btn btn-success" onClick={handleAdd}>➕</button>
        </div>
      </div>

      {/* Todo List */}
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`d-flex justify-content-between align-items-center p-2 mb-2 rounded ${
            isDarkMode ? "bg-dark text-white border border-secondary" : "bg-light"
          }`}
        >
          <div className="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo)}
              className="form-check-input"
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                opacity: todo.completed ? 0.6 : 1,
              }}
            >
              {todo.content}
            </span>
          </div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleDelete(todo.id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      ))}

      {/* Delete All */}
      {todos.length > 0 && (
        <div className="text-center mt-3">
          <button className="btn btn-outline-dark" onClick={handleDeleteAll} title="Delete All">
            🧹
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
