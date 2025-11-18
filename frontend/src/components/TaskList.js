import React from 'react';

export default function TaskList({ tasks, onEdit, onDelete, auth }){
  return (
    <div style={{ padding: '0 10px' }}> {/* Small padding for the list */}
      <h4>Tasks ({tasks.length})</h4>
      {tasks.map(t => (
        <div 
          key={t._id} 
          style={{ 
            // Task Card Style: Clean white background, soft border/shadow
            border: '1px solid #E3E9F0', // Very light blue/gray border
            padding: 15, 
            marginBottom: 15, 
            borderRadius: '8px', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            backgroundColor: 'white' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Title uses the Montserrat-based heading style color from index.css */}
            <strong 
              className="task-title" 
              style={{ 
                fontSize: '1.1em', 
                color: '#1A2E35', // Dark Navy Blue
                // Progress indicator logic
                textDecoration: t.progress === 'completed' ? 'line-through' : 'none',
                opacity: t.progress === 'completed' ? 0.7 : 1,
              }}
            >
              {t.title}
            </strong>
            
            {/* Progress and Due Date: Readable and clean */}
            <small style={{ 
              color: '#4A6C80', // Cool Muted Blue
              textAlign: 'right',
              minWidth: '150px' // Ensure date/progress doesn't wrap awkwardly
            }}>
              <span style={{ fontWeight: 'bold' }}>{t.progress}</span> 
              {t.dueDate ? (
                <div style={{ marginTop: '2px', fontSize: '0.85em' }}>
                    due {new Date(t.dueDate).toLocaleDateString()}
                </div>
              ) : ''}
            </small>
          </div>

          <div style={{ 
            marginTop: 8, 
            marginBottom: 12, 
            color: '#444' // Standard body text color
          }}>
            {t.description}
          </div>

          <div style={{ marginTop: 6 }}>
            {auth && auth.id === t.userId && (
              <>
                {/* Edit Button: Uses primary Teal style defined in index.css */}
                <button onClick={()=>onEdit(t)}>Edit</button>
                
                {/* Delete Button: Use a contrasting, warning color (e.g., Soft Red) */}
                <button 
                  onClick={()=>onDelete(t._id)} 
                  style={{ 
                    backgroundColor: '#E57373', // Soft Red
                    color: 'white' // White text for good contrast
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}