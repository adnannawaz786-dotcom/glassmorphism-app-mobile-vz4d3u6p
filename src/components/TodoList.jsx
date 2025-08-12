import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Edit3, Trash2, Calendar, Flag } from 'lucide-react';

const TodoList = ({ 
  todos, 
  onToggleComplete, 
  onDeleteTodo, 
  onEditTodo, 
  filter = 'all' 
}) => {
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today && !isToday;
    
    return {
      formatted: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      }),
      isToday,
      isPast
    };
  };

  if (filteredTodos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {filter === 'completed' ? 'No completed tasks' : 
           filter === 'active' ? 'No active tasks' : 'No tasks yet'}
        </h3>
        <p className="text-gray-300">
          {filter === 'all' ? 'Add your first task to get started!' : 
           `Switch to see your ${filter === 'active' ? 'completed' : 'active'} tasks`}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filteredTodos.map((todo) => {
          const dateInfo = formatDate(todo.dueDate);
          
          return (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`glass-card rounded-xl p-4 transition-all duration-200 ${
                todo.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleComplete(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500'
                      : 'border-gray-400 hover:border-purple-400'
                  }`}
                >
                  {todo.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-medium text-white leading-tight ${
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}>
                      {todo.text}
                    </h3>
                    
                    {/* Priority Badge */}
                    {todo.priority && todo.priority !== 'none' && (
                      <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                        <Flag className="w-3 h-3 inline mr-1" />
                        {todo.priority}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {todo.description && (
                    <p className={`text-sm mb-2 ${
                      todo.completed ? 'text-gray-500' : 'text-gray-300'
                    }`}>
                      {todo.description}
                    </p>
                  )}

                  {/* Due Date */}
                  {dateInfo && (
                    <div className={`flex items-center gap-1 text-xs ${
                      dateInfo.isPast && !todo.completed 
                        ? 'text-red-400' 
                        : dateInfo.isToday 
                        ? 'text-yellow-400' 
                        : 'text-gray-400'
                    }`}>
                      <Calendar className="w-3 h-3" />
                      {dateInfo.formatted}
                      {dateInfo.isToday && ' (Today)'}
                      {dateInfo.isPast && !todo.completed && ' (Overdue)'}
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="text-xs text-gray-500 mt-1">
                    Created {new Date(todo.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEditTodo(todo)}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 transition-colors"
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TodoList;