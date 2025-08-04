// Utility functions for the GTM Portfolio application

/**
 * Format currency values
 */
export const formatCurrency = (amount, currency = 'USD', notation = 'standard') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format large numbers with appropriate suffixes
 */
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Calculate time difference in human readable format
 */
export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now - past);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 'Today';
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
};

/**
 * Get company type badge styling
 */
export const getCompanyTypeBadge = (type) => {
  const badgeStyles = {
    startup: 'bg-pink-100 text-pink-800 border-pink-200',
    mnc: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return badgeStyles[type] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Get success rate color coding
 */
export const getSuccessRateColor = (rate) => {
  if (rate >= 95) return 'text-green-600';
  if (rate >= 90) return 'text-emerald-600';
  if (rate >= 80) return 'text-yellow-600';
  if (rate >= 70) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Generate random color for charts
 */
export const generateColor = (index) => {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];
  return colors[index % colors.length];
};

/**
 * Calculate growth rate between two values
 */
export const calculateGrowthRate = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Convert snake_case to Title Case
 */
export const toTitleCase = (str) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Debounce function calls
 */
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

/**
 * Generate industry-specific insights
 */
export const generateInsight = (caseStudy) => {
  const insights = [
    `${formatPercentage(caseStudy.success_rate)} success rate achieved through strategic positioning`,
    `${caseStudy.revenue_impact} revenue impact demonstrates exceptional market execution`,
    `LTV:CAC ratio of ${caseStudy.key_metrics?.ltv_cac_ratio} indicates highly efficient customer acquisition`,
    `${formatPercentage(caseStudy.key_metrics?.net_revenue_retention - 100)} net revenue retention shows strong product-market fit`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
};