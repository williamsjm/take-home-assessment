import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { List } from 'react-window';

function Items() {
  const { items, loading, error, pagination, fetchItems } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [focusedInput, setFocusedInput] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();

    fetchItems(controller.signal, {
      page: currentPage,
      pageSize: 20,
      search: debouncedSearch
    });

    return () => {
      controller.abort();
    };
  }, [fetchItems, currentPage, debouncedSearch]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Premium loading skeleton
  const LoadingSkeleton = () => (
    <div style={{ padding: '0 20px' }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            height: 72,
            marginBottom: 12,
            borderRadius: 12,
            background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            opacity: 1 - (i * 0.1)
          }}
        />
      ))}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );

  // Row component for virtualized list with premium styling
  const Row = ({ index, style }) => {
    const item = items[index];
    const isHovered = hoveredId === item.id;

    return (
      <div style={{ ...style, padding: '0 20px', boxSizing: 'border-box' }}>
        <Link
          to={'/items/' + item.id}
          style={{ textDecoration: 'none' }}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              marginBottom: 12,
              backgroundColor: '#ffffff',
              border: `2px solid ${isHovered ? '#6366f1' : '#e5e7eb'}`,
              borderRadius: 12,
              boxShadow: isHovered
                ? '0 8px 24px rgba(99, 102, 241, 0.15), 0 2px 8px rgba(99, 102, 241, 0.1)'
                : '0 1px 3px rgba(0, 0, 0, 0.04)',
              transform: isHovered ? 'translateY(-2px) scale(1.005)' : 'translateY(0) scale(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              height: 60
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: isHovered
                    ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
                    : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 600,
                  color: isHovered ? '#ffffff' : '#6b7280',
                  transition: 'all 0.3s ease'
                }}
              >
                {item.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: isHovered ? '#6366f1' : '#111827',
                    transition: 'color 0.3s ease',
                    marginBottom: 2
                  }}
                >
                  {item.name}
                </div>
                {item.category && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      fontWeight: 500
                    }}
                  >
                    {item.category}
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                fontSize: 20,
                color: isHovered ? '#6366f1' : '#9ca3af',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                transition: 'all 0.3s ease'
              }}
            >
              →
            </div>
          </div>
        </Link>
      </div>
    );
  };

  // Premium button style generator
  const getButtonStyle = (disabled, variant = 'primary') => {
    const isPrimary = variant === 'primary';

    return {
      padding: '10px 20px',
      backgroundColor: disabled
        ? '#f3f4f6'
        : isPrimary ? '#6366f1' : '#ffffff',
      color: disabled
        ? '#9ca3af'
        : isPrimary ? '#ffffff' : '#6366f1',
      border: isPrimary ? 'none' : '2px solid #6366f1',
      borderRadius: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 14,
      fontWeight: 600,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: disabled
        ? 'none'
        : isPrimary
          ? '0 2px 8px rgba(99, 102, 241, 0.25)'
          : '0 1px 3px rgba(0, 0, 0, 0.08)',
      transform: 'scale(1)',
      minWidth: 100
    };
  };

  // Page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const total = pagination.totalPages;
    const current = currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total);
      } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }

    return pages;
  };

  return (
    <div style={{
      padding: '24px 20px',
      maxWidth: 900,
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header with gradient */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          marginBottom: 8,
          fontSize: 32,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #111827 0%, #6366f1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Items Gallery
        </h1>
        <p style={{
          fontSize: 15,
          color: '#6b7280',
          fontWeight: 500,
          margin: 0
        }}>
          Browse through {pagination.total || 'our'} amazing items
        </p>
      </div>

      {/* Premium Search Input */}
      <div style={{ marginBottom: 28 }}>
        <label
          htmlFor="search-input"
          style={{
            display: 'block',
            marginBottom: 10,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}
        >
          Search items
        </label>
        <div style={{ position: 'relative', maxWidth: 500 }}>
          <div style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 18,
            color: focusedInput ? '#6366f1' : '#9ca3af',
            transition: 'color 0.3s ease',
            pointerEvents: 'none'
          }}>
            🔍
          </div>
          <input
            id="search-input"
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setFocusedInput(true)}
            onBlur={() => setFocusedInput(false)}
            style={{
              padding: '13px 16px 13px 48px',
              width: '100%',
              border: `2px solid ${focusedInput ? '#6366f1' : '#e5e7eb'}`,
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: focusedInput
                ? '0 0 0 4px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(99, 102, 241, 0.15)'
                : '0 1px 3px rgba(0, 0, 0, 0.04)',
              backgroundColor: '#ffffff'
            }}
            aria-label="Search for items"
          />
        </div>
      </div>

      {/* Error state with premium styling */}
      {error && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          marginBottom: 20,
          borderRadius: 12,
          border: '2px solid #fecaca',
          fontSize: 14,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && <LoadingSkeleton />}

      {/* Empty state */}
      {!loading && !error && !items.length && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#fafbfc',
          borderRadius: 16,
          border: '2px dashed #e5e7eb'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 8
          }}>
            No items found
          </p>
          <p style={{
            fontSize: 14,
            color: '#6b7280',
            margin: 0
          }}>
            Try adjusting your search terms
          </p>
        </div>
      )}

      {/* Items list */}
      {items.length > 0 && (
        <div style={{
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#fafbfc',
          padding: '12px 0'
        }}>
          <List
            rowComponent={Row}
            rowProps={{}}
            rowCount={items.length}
            rowHeight={84}
            style={{ height: 540, width: '100%' }}
          />
        </div>
      )}

      {/* Premium Pagination */}
      {items.length > 0 && (
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
          role="navigation"
          aria-label="Pagination"
        >
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || loading}
            aria-label="Go to previous page"
            style={{
              ...getButtonStyle(currentPage === 1 || loading, 'secondary'),
              marginRight: 8
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1 && !loading) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
            }}
          >
            ← Prev
          </button>

          {/* Page numbers */}
          <div style={{ display: 'flex', gap: 6 }}>
            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${idx}`}
                    style={{
                      padding: '10px 8px',
                      color: '#9ca3af',
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  >
                    ...
                  </span>
                );
              }

              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: isActive ? '#6366f1' : '#ffffff',
                    color: isActive ? '#ffffff' : '#6366f1',
                    border: `2px solid ${isActive ? '#6366f1' : '#e5e7eb'}`,
                    borderRadius: 8,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    minWidth: 40,
                    boxShadow: isActive
                      ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                      : '0 1px 3px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && !loading) {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage >= pagination.totalPages || loading}
            aria-label="Go to next page"
            style={{
              ...getButtonStyle(currentPage >= pagination.totalPages || loading, 'primary'),
              marginLeft: 8
            }}
            onMouseEnter={(e) => {
              if (currentPage < pagination.totalPages && !loading) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.25)';
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Pagination info */}
      {items.length > 0 && (
        <div
          style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: 13,
            color: '#6b7280',
            fontWeight: 500
          }}
          aria-live="polite"
        >
          Showing {((currentPage - 1) * pagination.pageSize) + 1} - {Math.min(currentPage * pagination.pageSize, pagination.total)} of {pagination.total} items
        </div>
      )}
    </div>
  );
}

export default Items;
