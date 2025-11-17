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
      <div style={style}>
        <Link to={'/items/' + item.id}>{item.name}</Link>
      </div>
    );
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Search input */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="search-input" style={{ display: 'block', marginBottom: 4 }}>
          Search items:
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: 8, width: 300 }}
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
        <FixedSizeList
          height={400}
          itemCount={items.length}
          itemSize={50}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      )}

      {/* Pagination controls */}
      {items.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }} role="navigation" aria-label="Pagination">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || loading}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span aria-live="polite" aria-atomic="true">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= pagination.totalPages || loading}
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Items;