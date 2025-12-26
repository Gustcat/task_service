import { useState } from 'react';

function TaskForm({ onCreate, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return; // не создавать пустое название
    onCreate({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
      }}
    >
      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Название:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '6px', marginTop: '4px' }}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Описание:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '6px',
            marginTop: '4px',
            resize: 'vertical',
          }}
        />
      </label>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit">Создать</button>
      </div>
    </form>
  );
}

export default TaskForm;