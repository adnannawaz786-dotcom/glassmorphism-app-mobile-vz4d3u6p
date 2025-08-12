// Utility functions for the glassmorphism todo app

// Generate unique IDs for todos
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const todoDate = new Date(date);
  const diffTime = Math.abs(now - todoDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Tomorrow';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return todoDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validate todo input
export const validateTodo = (todo) => {
  const errors = {};
  
  if (!todo.title || todo.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  
  if (todo.title && todo.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  if (todo.description && todo.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Filter todos based on status
export const filterTodos = (todos, filter) => {
  if (!todos) return [];
  
  switch (filter) {
    case 'completed':
      return todos.filter(todo => todo.completed);
    case 'pending':
      return todos.filter(todo => !todo.completed);
    case 'all':
    default:
      return todos;
  }
};

// Sort todos by various criteria
export const sortTodos = (todos, sortBy = 'created') => {
  if (!todos) return [];
  
  const sortedTodos = [...todos];
  
  switch (sortBy) {
    case 'title':
      return sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
    case 'completed':
      return sortedTodos.sort((a, b) => a.completed - b.completed);
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sortedTodos.sort((a, b) => {
        const aPriority = priorityOrder[a.priority] || 1;
        const bPriority = priorityOrder[b.priority] || 1;
        return bPriority - aPriority;
      });
    case 'created':
    default:
      return sortedTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

// Get priority color classes
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'text-red-400 bg-red-500/10 border-red-500/20';
    case 'medium':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    case 'low':
      return 'text-green-400 bg-green-500/10 border-green-500/20';
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

// Get completion percentage
export const getCompletionPercentage = (todos) => {
  if (!todos || todos.length === 0) return 0;
  
  const completedTodos = todos.filter(todo => todo.completed).length;
  return Math.round((completedTodos / todos.length) * 100);
};

// Debounce function for search/input
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Search todos by title or description
export const searchTodos = (todos, searchTerm) => {
  if (!todos || !searchTerm) return todos;
  
  const term = searchTerm.toLowerCase().trim();
  return todos.filter(todo => 
    todo.title.toLowerCase().includes(term) ||
    (todo.description && todo.description.toLowerCase().includes(term))
  );
};

// Generate glassmorphism styles
export const getGlassmorphismStyles = (opacity = 0.1) => {
  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };
};

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Local storage helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
    return false;
  }
};

// Generate random gradient backgrounds
export const getRandomGradient = () => {
  const gradients = [
    'from-purple-400 via-pink-500 to-red-500',
    'from-blue-400 via-purple-500 to-pink-500',
    'from-green-400 via-blue-500 to-purple-500',
    'from-yellow-400 via-red-500 to-pink-500',
    'from-indigo-400 via-purple-500 to-pink-500',
    'from-cyan-400 via-blue-500 to-purple-500',
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Format time ago
export const timeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};