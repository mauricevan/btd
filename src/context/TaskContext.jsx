import React, { createContext, useContext, useState, useEffect } from "react";
import { getUsers } from "../services/auth";
import * as taskApi from "../services/tasks";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { id: currentUserId } = useAuth() || {};
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const { createTaskCompletedNotification } = useNotifications();

  // Fetch users and tasks on mount
  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  async function fetchUsers() {
    const data = await getUsers();
    setUsers(data);
  }

  async function fetchTasks() {
    const data = await taskApi.getAllTasks();
    setTasks(data);
  }

  // Keep users in sync with auth system (manual refresh)
  const refreshUsers = async () => {
    await fetchUsers();
  };

  // Task CRUD
  const addTask = async (task) => {
    await taskApi.addTask(task);
    await fetchTasks();
  };
  
  const updateTask = async (id, updates) => {
    const oldTask = tasks.find(t => t.id === id);
    await taskApi.updateTask(id, updates);
    await fetchTasks();
    
    // Check if task was marked as completed
    if (oldTask && !oldTask.completed && updates.completed) {
      const currentUser = users.find(u => u.id === currentUserId);
      const task = tasks.find(t => t.id === id);
      if (currentUser && task) {
        await createTaskCompletedNotification(task, currentUser);
      }
    }
  };
  
  const forwardTask = async (id, userId) => {
    await taskApi.updateTask(id, { userId });
    await fetchTasks();
  };
  
  const deleteTask = async (id) => {
    await taskApi.deleteTask(id);
    await fetchTasks();
  };

  return (
    <TaskContext.Provider value={{ tasks, users, addTask, updateTask, forwardTask, deleteTask, refreshUsers }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
} 