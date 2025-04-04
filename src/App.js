import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (input.trim()) {
      const newTask = {
        id: Date.now(), // Use timestamp as unique ID
        text: input,
        completed: false,
        priority: priority,
      };
      setTasks([...tasks, newTask]);
      setInput("");
      setPriority("medium");
    }
  };

  // Handle pressing Enter to add a task
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Edit a task
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  // Save edited task
  const saveEdit = () => {
    if (editText.trim()) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingId ? { ...task, text: editText } : task
      );
      setTasks(updatedTasks);
      setEditingId(null);
    }
  };

  // Sort tasks by priority
  const sortByPriority = () => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedTasks = [...tasks].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    setTasks(sortedTasks);
  };

  // Sort tasks by time added
  const sortByTimeAdded = () => {
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.id) - new Date(b.id));
    setTasks(sortedTasks);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>TODO List</h1>
      </header>

      {/* Task Input Form */}
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
          className="task-input"
          onKeyDown={handleKeyPress} // Add Enter key functionality here
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button onClick={addTask} className="add-button">
          Add Task
        </button>
      </div>

      {/* Sort Buttons */}
      <div className="sort-buttons">
        <button onClick={sortByPriority} className="sort-button">
          Sort by Priority
        </button>
        <button onClick={sortByTimeAdded} className="sort-button">
          Sort by Time Added
        </button>
      </div>

      {/* Task List */}
      <div className="task-list-container">
        <h2>Your Tasks</h2>
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item priority-${task.priority} ${task.completed ? "completed" : ""
                }`}
            >
              {editingId === task.id ? (
                // Edit Mode
                <div className="edit-form">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <button onClick={saveEdit} className="save-button">
                    Save
                  </button>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        setTasks(
                          tasks.map((t) =>
                            t.id === task.id ? { ...t, completed: !t.completed } : t
                          )
                        )
                      }
                      className="task-checkbox"
                    />
                    <span className="task-text">{task.text}</span>
                  </div>
                  <div className="task-actions">
                    {/* Edit Button with Notebook Emoji */}
                    <button onClick={() => startEdit(task)} className="edit-button">
                      📒
                    </button>

                    {/* Delete Button with Bin Emoji */}
                    <button onClick={() => deleteTask(task.id)} className="delete-button">
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
