import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList } from 'react-window';

function Items() {
  const { items, loading, error, pagination, fetchItems } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      // Reset to page 1 when search changes
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();

    // Fetch with pagination and search params
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

  // Row component for virtualized list
  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          paddingLeft: 12
        }}
      >
        <Link
          to={'/items/' + item.id}
          style={{
            textDecoration: 'none',
            color: '#007bff',
            fontSize: 14
          }}
        >
          {item.name}
        </Link>
      </div>
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Items</h1>

      {/* Search input */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="search-input" style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Search items:
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 12px',
            width: '100%',
            maxWidth: 400,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 14
          }}
          aria-label="Search for items"
        />
      </div>

      {/* Error state */}
      {error && (
        <div style={{ padding: 12, backgroundColor: '#fee', color: '#c00', marginBottom: 16, borderRadius: 4 }}>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && <p>Loading items...</p>}

      {/* Empty state */}
      {!loading && !error && !items.length && <p>No items found.</p>}

      {items.length > 0 && (
        <div style={{ border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden' }}>
          <FixedSizeList
            height={400}
            itemCount={items.length}
            itemSize={50}
            width="100%"
          >
            {Row}
          </FixedSizeList>
        </div>
      )}

      {/* Pagination controls */}
      {items.length > 0 && (
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
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
              padding: '8px 16px',
              backgroundColor: currentPage === 1 || loading ? '#eee' : '#007bff',
              color: currentPage === 1 || loading ? '#999' : 'white',
              border: 'none',
              borderRadius: 4,
              cursor: currentPage === 1 || loading ? 'not-allowed' : 'pointer',
              fontSize: 14
            }}
          >
            Previous
          </button>
          <span aria-live="polite" aria-atomic="true" style={{ fontSize: 14, color: '#666' }}>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= pagination.totalPages || loading}
            aria-label="Go to next page"
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage >= pagination.totalPages || loading ? '#eee' : '#007bff',
              color: currentPage >= pagination.totalPages || loading ? '#999' : 'white',
              border: 'none',
              borderRadius: 4,
              cursor: currentPage >= pagination.totalPages || loading ? 'not-allowed' : 'pointer',
              fontSize: 14
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Items;