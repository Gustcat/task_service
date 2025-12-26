import React, { useState } from 'react';
import styles from './TaskList.module.css';

function TaskList({ tasks, onToggle, onDelete }) {
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleDescription = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const isExpanded = (id) => expandedIds.includes(id);

  const renderDescription = (task) => {
    const expanded = isExpanded(task.id);
    const isLong = task.description && task.description.length > 25;

    return (
      <>
        <span className={styles.descriptionShort}>
          {task.description || '-'}
        </span>

        {isLong && (
          <button
            className={styles.expandButton}
            onClick={() => toggleDescription(task.id)}
            title={expanded ? 'Свернуть' : 'Развернуть'}
          >
            {expanded ? '▲' : '▼'}
          </button>
        )}
      </>
    );
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.headerCell}>Название</th>
          <th className={styles.headerCell}>Описание</th>
          <th className={styles.headerCell}>Дата создания</th>
          <th className={styles.headerCell}>Выполнена</th>
          <th className={styles.headerCell}>Действия</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => {
          const expanded = isExpanded(task.id);

          return (
            <React.Fragment key={task.id}>
              <tr
                className={
                  expanded ? styles.rowNoBorder : styles.row
                }
              >
                <td className={styles.cell}>{task.title}</td>

                <td className={`${styles.cell} ${styles.descriptionCell}`}>
                  {renderDescription(task)}
                </td>

                <td className={styles.cell}>
                  {new Date(task.created_at).toLocaleString()}
                </td>

                <td className={styles.cell}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      onToggle(task.id, !task.completed)
                    }
                  />
                </td>

                <td className={styles.cell}>
                  <button onClick={() => onDelete(task.id)}>
                    Удалить
                  </button>
                </td>
              </tr>

              {expanded && (
                <tr className={styles.expandedRow}>
                  <td colSpan={5} className={styles.expandedCell}>
                    {task.description}
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

export default TaskList;