import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState = ({
  icon = '🌸',
  title = 'No records found',
  description = 'Start adding transactions to organize your personal finances.',
  actionText,
  onAction
}) => {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button
          className="btn btn-primary"
          onClick={onAction}
          style={{ marginTop: '0.5rem' }}
          id="empty-state-action-btn"
        >
          <Plus size={16} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
