import { useState, useEffect } from 'react';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('glassmorphism-todos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  // Add new todo
  const addTodo = (text) => {
    if (!text.trim()) return;
    
    const newTodo = {
      id: Date.now() + Math.random(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // Edit todo text
  const updateTodo = (id, newText) => {
    if (!newText.trim()) return;
    
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, text: newText.trim() }
          : todo
      )
    );
  };

  // Set todo priority
  const setPriority = (id, priority) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, priority }
          : todo
      )
    );
  };

  // Clear completed todos
  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  // Mark all todos as completed
  const completeAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted
      }))
    );
  };

  // Get filtered todos based on current filter and search query
  const getFilteredTodos = () => {
    let filtered = todos;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (filter) {
      case 'active':
        return filtered.filter(todo => !todo.completed);
      case 'completed':
        return filtered.filter(todo => todo.completed);
      default:
        return filtered;
    }
  };

  // Get todo statistics
  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      completionRate
    };
  };

  // Get todos by priority
  const getTodosByPriority = () => {
    const high = todos.filter(todo => todo.priority === 'high' && !todo.completed);
    const medium = todos.filter(todo => todo.priority === 'medium' && !todo.completed);
    const low = todos.filter(todo => todo.priority === 'low' && !todo.completed);

    return { high, medium, low };
  };

  return {
    // State
    todos,
    filter,
    searchQuery,
    
    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setPriority,
    clearCompleted,
    completeAll,
    setFilter,
    setSearchQuery,
    
    // Computed values
    filteredTodos: getFilteredTodos(),
    stats: getStats(),
    todosByPriority: getTodosByPriority(),
    
    // Utility
    hasActiveTodos: todos.some(todo => !todo.completed),
    hasCompletedTodos: todos.some(todo => todo.completed),
    isEmpty: todos.length === 0
  };
};

export default useTodos;
