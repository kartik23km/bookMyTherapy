/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string e.g. "2026-10-04"
 * @returns {string} - e.g. "4 Oct 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format price in Indian Rupees
 */
export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

/**
 * Generate a unique booking ID
 */
export function generateBookingId() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randPart = Math.floor(Math.random() * 900 + 100);
  return `BMT-${datePart}-${randPart}`;
}

/**
 * Get tag label from slug
 */
export function getTagLabel(slug, tags) {
  const tag = tags.find(t => t.slug === slug || t.id === slug);
  return tag ? tag.label : slug;
}

/**
 * Filter sessions by multiple criteria
 */
export function filterSessions(sessions, filters, tags) {
  let result = [...sessions];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.tags.some(t => {
        const label = getTagLabel(t, tags);
        return label.toLowerCase().includes(q);
      })
    );
  }

  // Tag filter
  if (filters.tags && filters.tags.length > 0) {
    result = result.filter(s =>
      filters.tags.some(ft => s.tags.includes(ft))
    );
  }

  // Mode filter
  if (filters.mode) {
    result = result.filter(s => s.mode.toLowerCase() === filters.mode.toLowerCase());
  }

  // Sort
  if (filters.sortBy === 'date') {
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (filters.sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else {
    // recommended: featured first, then by date
    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(a.date) - new Date(b.date);
    });
  }

  return result;
}

/**
 * Get mode badge color
 */
export function getModeColor(mode) {
  switch (mode?.toLowerCase()) {
    case 'online': return 'bg-blue-50 text-blue-700';
    case 'in-person': return 'bg-amber-50 text-amber-700';
    case 'hybrid': return 'bg-purple-50 text-purple-700';
    default: return 'bg-gray-50 text-gray-700';
  }
}

/**
 * Get status badge styles
 */
export function getStatusStyle(status) {
  switch (status) {
    case 'upcoming': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'completed': return 'bg-gray-50 text-gray-500 border-gray-100';
    case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
    case 'active': return 'bg-emerald-50 text-emerald-700';
    case 'inactive': return 'bg-gray-50 text-gray-500';
    default: return 'bg-gray-50 text-gray-500';
  }
}

/**
 * Truncate text
 */
export function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + '…' : str;
}
