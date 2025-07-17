import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import CreateTaskForm from './components/CreateTaskForm';
import './App.css';
import Login from './components/Login';


const App = () => {

  const API_BASE = 'http://localhost:5000/api/';
  // tasks: Array holding all todo tasks
  const [tasks, setTasks] = useState([]);

  // editingTask: Holds the task being edited (for the modal).
  const [editingTask, setEditingTask] = useState(null);

  // successMessage: Stores a message to show after actions (add, edit, delete, done).
  const [successMessage, setSuccessMessage] = useState('');

  // formRef: Reference to control the Create/Edit Task modal.
  const formRef = useRef();

  // isLoggedIn: Tracks if the user is logged in.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // useEffect: On first render, loads tasks from localStorage (if any) and sets them in state.
  // useEffect(() => {
  //   const storedTasks = localStorage.getItem('todoTasks');
  //   console.log('Loaded from storage:', storedTasks);
  //   if (storedTasks) {
  //     setTasks(JSON.parse(storedTasks));
  //   }
  // }, []);
  // it will run only on first render


  // useEffect: Every time tasks changes, saves the updated tasks array to localStorage.
  // useEffect(() => {
  //   localStorage.setItem('todoTasks', JSON.stringify(tasks));
  //   console.log('Saved to storage:', tasks);
  // }, [tasks]);
  useEffect(() => {
    fetch(`${API_BASE}tasks`)
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []); // Only run on mount
// it will run every time tasks changes


  // CREATE
  // const handleAddTask = (newTask) => {
  //   setTasks((prevTasks) => [...prevTasks, { ...newTask, isFavorite: false }]);
  //   setSuccessMessage('Task Created Successfully!');
  //   setTimeout(() => setSuccessMessage(''), 1000);
  // };

  const handleAddTask = (newTask) => {
    fetch(`${API_BASE}tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      return response.json();
    })
    .then(data => {
      setTasks(prev => [...prev, data]);
      setSuccessMessage('Task Created Successfully!');
      setTimeout(() => setSuccessMessage(''), 1000);
    })
    .catch(error => {
      console.error('Error adding task:', error);
      alert('Something went wrong while adding the task.');
    });
  };
  
  

  // DELETE
  // const handleDeleteTask = (id) => {
  //   setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
  //   setSuccessMessage('Task Deleted Successfully!');
  //   setTimeout(() => setSuccessMessage(''), 1000);
  // };

  // UPDATE
  const handleUpdateTask = async (updatedTask) => {
    try {
      const res = await fetch(`${API_BASE}tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      });
      if (!res.ok) {
        alert("Something went wrong while updating the task.");
        return;
      }
      const data = await res.json();
      setTasks(prev => prev.map(task => task.id === data.id ? data : task));
      setSuccessMessage('Task updated successfully!');
      setTimeout(() => setSuccessMessage(''), 1000);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Something went wrong.");
    }
  };
  
  // DELETE
  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${API_BASE}tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        alert("Something went wrong while deleting the task.");
        return;
      }
      setTasks(prev => prev.filter(task => task.id !== id));
      setSuccessMessage('Task deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 1000);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting the task.");
    }
  };

  
  // EDIT: Open modal with task data
  const handleEditTask = (task) => {
    setEditingTask(task);
    formRef.current.openModal(task);
  };

  // When creating, open modal with no task
  const handleOpenCreate = () => {
    setEditingTask(null);
    formRef.current.openModal();
  };

  // Done
  // const handleDoneTask = (id) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map(task => {
  //       if (task.id === id) {
  //         // Toggle the status: if 'Done', set to 'Open', otherwise set to 'Done'
  //         const newStatus = task.status === 'Done' ? 'Open' : 'Done';
  //         setSuccessMessage(`Task marked as ${newStatus} Successfully!`); // Update success message
  //         return { ...task, status: newStatus };
  //       }
  //       return task;
  //     })
  //   );
  //   setSuccessMessage('Task Done Successfully!');
  //   setTimeout(() => setSuccessMessage(''), 1000);
  // };
  const handleDoneTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    const newStatus = task.status === 'Done' ? 'Open' : 'Done';
    try {
      const res = await fetch(`${API_BASE}tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
      const data = await res.json();
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      setSuccessMessage(`Task marked as ${newStatus} successfully!`);
      setTimeout(() => setSuccessMessage(''), 1000);
    } catch (err) {
      console.error(err);
      alert('Failed to update task status');
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Optional: clear success message when filter changes
    setSuccessMessage('');
  };

  // Toggle Favorite status
  // const handleToggleFavorite = (id) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map(task =>
  //       task.id === id ? { ...task, isFavorite: !task.isFavorite } : task
  //     )
  //   );
  //   setSuccessMessage('Task favorite status updated!');
  //   setTimeout(() => setSuccessMessage(''), 1000);
  // };
  const handleToggleFavorite = async (id, isCurrentlyFavorite) => {
    const newFavoriteStatus = !isCurrentlyFavorite;
    try {
      const res = await fetch(`${API_BASE}tasks/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: newFavoriteStatus })
      });
      if (!res.ok) {
        throw new Error('Failed to update favorite status');
      }
      const data = await res.json();
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      setSuccessMessage('Task favorite status updated!');
      setTimeout(() => setSuccessMessage(''), 1000);
    } catch (err) {
      console.error(err);
      alert('Failed to update favorite status');
    }
  };
  


  // Calculate dynamic counts for TaskFilterCard
  const allTasksCount = tasks.length;
  const myTasksCount = tasks.filter(task => task.assignee === 'Rahul Jadhav' && task.status !== 'Done').length; // Assuming 'Rahul Jadhav' is your assignee. Adjust if needed. Also, assuming 'My Task' means not yet done.
  const favoritesCount = tasks.filter(task => task.isFavorite).length;
  const doneTasksCount = tasks.filter(task => task.status === 'Done').length;

  // Calculate Due Soon tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);
  sevenDaysFromNow.setHours(23, 59, 59, 999); // Normalize to end of day 7 days from now

  const dueSoonTasksCount = tasks.filter(task => {
    if (!task.dueDate) return false; // Task has no due date, so it's not due soon

    const taskDueDate = new Date(task.dueDate); // Convert task's due date string to Date object
    taskDueDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Check if the task's due date is today or in the future, and within 7 days from today, and not already done
    return taskDueDate >= today && taskDueDate <= sevenDaysFromNow && task.status !== 'Done';
  }).length;

  const taskCounts = {
    "All": allTasksCount,
    "My Task": myTasksCount,
    "Favorites": favoritesCount,
    "Done": doneTasksCount,
    "Due Soon": dueSoonTasksCount,
  };


  // Purpose: If the user is not logged in, show the login page.
  // After login: The main app is rendered.
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }
  return (
    <div className="d-flex flex-column body" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header onAddClick={handleOpenCreate} onLogout={handleLogout} />

      {/* Body: Sidebar + Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="col-md-2 p-3">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-4">
          <div className="row mb-3">
            <div className="col">
              {successMessage && (
                <div className="taskSuccess">
                  {successMessage}
                </div>

              )}
              <MainContent
                tasks={tasks}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onDone={handleDoneTask}
                onToggleFavorite={handleToggleFavorite}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                taskCounts={taskCounts}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Create Task Modal */}
      <CreateTaskForm
        ref={formRef}
        onSubmit={handleAddTask}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default App;
