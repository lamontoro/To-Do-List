import React, { useState } from 'react';

function ToDoList() {
    const [tasks, setTasks] = useState([
        { text: "Task 1", completed: false, priority: "Medium", dueDate: "" },
        { text: "Task 2", completed: false, priority: "High", dueDate: "" },
        { text: "Task 3", completed: false, priority: "Low", dueDate: "" }
    ]);
    const [newTask, setNewTask] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState("Medium");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [archivedTasks, setArchivedTasks] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("All");

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            setTasks(t => [...t, { text: newTask, completed: false, priority: newTaskPriority, dueDate: newTaskDueDate }]);
            setNewTask("");
            setNewTaskPriority("Medium");
            setNewTaskDueDate("");
        }
    }

    function deleteTask(index) {
        setTasks(tasks.filter((_, i) => i !== index));
    }

    function deleteAllTasks() {
        setTasks([]);
    }

    function markAllDone() {
        setTasks(tasks.map(task => ({ ...task, completed: true })));
    }

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function archiveTask(index) {
        setArchivedTasks([...archivedTasks, tasks[index]]);
        deleteTask(index);
    }

    function restoreTask(index) {
        setTasks([...tasks, archivedTasks[index]]);
        setArchivedTasks(archivedTasks.filter((_, i) => i !== index));
    }

    function deleteArchivedTask(index) {
        setArchivedTasks(archivedTasks.filter((_, i) => i !== index));
    }

    function startEditing(index) {
        setEditingIndex(index);
        setEditText(tasks[index].text);
    }

    function handleEditChange(event) {
        setEditText(event.target.value);
    }

    function saveEdit(index) {
        const updatedTasks = [...tasks];
        updatedTasks[index].text = editText;
        setTasks(updatedTasks);
        setEditingIndex(null);
    }

    function toggleTaskCompletion(index) {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    }

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
        if (filter === "All") return matchesSearch;
        if (filter === "Completed") return matchesSearch && task.completed;
        if (filter === "Incomplete") return matchesSearch && !task.completed;
        return true;
    });

    return (
        <div className="to-do-list">
            <h1 className="header">
                <img src="/logo.png" alt="Logo" className="logo" />
                <span className="header-text">Check-List</span>
            </h1>

            <div className="controls">
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            addTask();
                        }
                    }}
                />
                <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                </select>
                <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
                <button className="add-button" onClick={addTask}>✅ Add Task</button>
            </div>

            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Completed">Completed</option>
                    <option value="Incomplete">Incomplete</option>
                </select>
            </div>

            <div className="task-list">
                {filteredTasks.map((task, index) => (
                    <div key={index} className={`task-card ${task.priority.toLowerCase()} ${task.completed ? "completed" : ""}`}>
                        <div className="task-content">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(index)}
                            />
                            {editingIndex === index ? (
                                <>
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={handleEditChange}
                                    />
                                    <button className="save-button" onClick={() => saveEdit(index)}>💾</button>
                                </>
                            ) : (
                                <>
                                    <span className="text">{task.text}</span>
                                    <span className="due-date">{task.dueDate}</span>
                                    <span className="priority">{task.priority}</span>
                                </>
                            )}
                        </div>
                        <div className="task-actions">
                            <button className="delete-button" onClick={() => deleteTask(index)}>⊘</button>
                            <button className="move-button" onClick={() => moveTaskUp(index)}>⬆</button>
                            <button className="move-button" onClick={() => moveTaskDown(index)}>⬇</button>
                            <button className="edit-button" onClick={() => startEditing(index)}>📝</button>
                            <button className="archive-button" onClick={() => archiveTask(index)}>📥</button>
                        </div>
                    </div>
                ))}
            </div>

            {tasks.length > 0 && (
                <div className="bulk-actions">
                    <button className="delete-all-button" onClick={deleteAllTasks}>🗑️ Delete All</button>
                    <button className="done-all-button" onClick={markAllDone}>✔️ Done All</button>
                </div>
            )}

            {archivedTasks.length > 0 && (
                <div className="archived-tasks">
                    <h2>Archived Tasks</h2>
                    <div className="task-list">
                        {archivedTasks.map((task, index) => (
                            <div key={index} className="task-card archived">
                                <div className="task-content">
                                    <span className="text">{task.text}</span>
                                </div>
                                <div className="task-actions">
                                    <button className="restore-button" onClick={() => restoreTask(index)}>🔄</button>
                                    <button className="delete-button" onClick={() => deleteArchivedTask(index)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToDoList;