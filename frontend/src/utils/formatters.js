// Format INR Currency
export const formatINR = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

// Format Date: e.g. "15 Oct 2026"
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Today's date in YYYY-MM-DD
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Current Month in YYYY-MM
export const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Category Icon Mapping
export const getCategoryIcon = (category) => {
  const map = {
    Salary: '💼',
    Freelance: '💻',
    Scholarship: '🎓',
    Gift: '🎁',
    'Other Income': '✨',
    Food: '🍱',
    Travel: '🚗',
    Education: '📚',
    Shopping: '🛍️',
    Bills: '💡',
    Health: '💊',
    Entertainment: '🎬',
    Groceries: '🛒',
    'Other Expense': '🏷️'
  };
  return map[category] || '💸';
};

// Category Colors for Charts
export const CATEGORY_COLORS = [
  '#FFB6C1', // Blush Pink
  '#8E7CC3', // Soft Lavender
  '#81C784', // Mint Green
  '#FFD54F', // Warm Sunshine
  '#4FC3F7', // Sky Blue
  '#FF8A65', // Peach Coral
  '#BA68C8', // Orchid
  '#4DB6AC', // Teal Pastel
  '#DCE775', // Lime Pastel
  '#A1887F'  // Soft Muted
];
