import React, { useEffect, useState } from 'react';
import apiClient from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toast from './components/Toast';
import Modal from './components/Modal';

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedTaskIds, setExpandedTaskIds] = useState([]);

  // Загрузка задач
  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке задач:", err);
      setError("Ошибка при загрузке задач");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Авто-очистка ошибки через 4 секунды
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const adaptErrorMessage = (err) => {
    if (err.response?.data?.error) {
      const detail = err.response.data.error;
      if (detail.includes("already exists")) return "Задача с таким названием уже существует";
    }
    return "Произошла ошибка при создании задачи";
  };

  const createTask = async (task) => {
    try {
      await apiClient.post('/tasks', task);
      await fetchTasks();
      setShowForm(false);
    } catch (err) {
      console.error("Ошибка при создании задачи:", err);
      console.log("err.response:", err.response);         // что пришло с сервера
      console.log("err.response.data:", err.response?.data);
      const msg = err.response?.data?.error ? adaptErrorMessage(err) : "Ошибка при создании задачи";
      console.log("Сообщение для Toast:", msg);
      setError(msg);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await apiClient.patch(`/tasks/${id}`, { completed });
      await fetchTasks();
    } catch (err) {
      console.error("Ошибка при обновлении задачи:", err);
      setError("Ошибка при обновлении статуса задачи");
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Ошибка при удалении задачи:", err);
      setError("Ошибка при удалении задачи");
    }
  };

  const toggleExpand = (id) => {
    setExpandedTaskIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Заголовок */}
      <h1 style={{ marginTop: 0, textAlign: 'left' }}>Task Manager</h1>

      {/* Кнопка открытия формы */}
      <button onClick={() => setShowForm(true)} style={{ marginBottom: '10px' }}>
        Создать задачу
      </button>

      {/* Модальное окно */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <TaskForm onCreate={createTask} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {/* Таблица задач */}
      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />

      {/* Toast поверх модального окна */}
      <Toast message={error} />
    </div>
  );
}

export default App;