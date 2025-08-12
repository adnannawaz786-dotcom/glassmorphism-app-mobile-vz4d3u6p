import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, X, Check } from 'lucide-react';

const TodoForm = ({ 
  onAddTodo, 
  onUpdateTodo, 
  editingTodo, 
  onCancelEdit,
  isVisible = true 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority || 'medium');
      setCategory(editingTodo.category || 'personal');
      setErrors({});
    }
  }, [editingTodo]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const todoData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        completed: editingTodo?.completed || false
      };

      if (editingTodo) {
        await onUpdateTodo(editingTodo.id, todoData);
      } else {
        await onAddTodo(todoData);
      }

      // Reset form after successful submission
      if (!editingTodo) {
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting todo:', error);
      setErrors({ submit: 'Failed to save todo. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('personal');
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-red-400' }
  ];

  const categoryOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'other', label: 'Other' }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl mx-auto mb-8"
      >
        <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-lg bg-white/10 shadow-xl">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              {editingTodo ? (
                <>
                  <Edit3 size={20} className="text-blue-400" />
                  Edit Todo
                </>
              ) : (
                <>
                  <Plus size={20} className="text-green-400" />
                  Add New Todo
                </>
              )}
            </h2>
            
            {editingTodo && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                aria-label="Cancel editing"
              >
                <X size={16} />
              </motion.button>
            )}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-white/90">
                Title *
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
                placeholder="Enter todo title..."
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-400/50' : 'border-white/20'
                }`}
                maxLength={100}
                disabled={isSubmitting}
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-sm"
                >
                  {errors.title}
                </motion.p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-white/90">
                Description
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: null });
                }}
                placeholder="Enter description (optional)..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all resize-none ${
                  errors.description ? 'border-red-400/50' : 'border-white/20'
                }`}
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.description}
                  </motion.p>
                )}
                <p className="text-white/50 text-xs ml-auto">
                  {description.length}/500
                </p>
              </div>
            </div>

            {/* Priority and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority Field */}
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-medium text-white/90">
                  Priority
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                >
                  {priorityOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-gray-800 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </motion.select>
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-white/90">
                  Category
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                >
                  {categoryOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-gray-800 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-400 text-sm"
              >
                {errors.submit}
              </motion.div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {editingTodo ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    {editingTodo ? 'Update Todo' : 'Add Todo'}
                  </>
                )}
              </motion.button>

              {!editingTodo && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Clear
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoForm;