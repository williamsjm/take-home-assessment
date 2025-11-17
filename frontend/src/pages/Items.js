import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { List } from 'react-window';
import styles from './Items.module.css';

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

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={styles.loadingContainer}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={styles.skeletonItem}
          style={{ opacity: 1 - (i * 0.1) }}
        />
      ))}
    </div>
  );

  // Row component for virtualized list
  const Row = ({ index, style }) => {
    const item = items[index];
    const isHovered = hoveredId === item.id;

    return (
      <div style={style} className={styles.rowWrapper}>
        <Link
          to={'/items/' + item.id}
          className={styles.itemLink}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className={styles.itemCard}>
            <div className={styles.itemContent}>
              <div className={styles.itemIcon}>
                {item.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className={styles.itemName}>{item.name}</div>
                {item.category && (
                  <div className={styles.itemCategory}>{item.category}</div>
                )}
              </div>
            </div>
            <div className={styles.itemArrow}>→</div>
          </div>
        </Link>
      </div>
    );
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Items Gallery</h1>
        <p className={styles.subtitle}>
          Browse through {pagination.total || 'our'} amazing items
        </p>
      </div>

      <div className={styles.searchContainer}>
        <label htmlFor="search-input" className={styles.searchLabel}>
          Search items
        </label>
        <div className={styles.searchInputWrapper}>
          <div className={`${styles.searchIcon} ${focusedInput ? styles.focused : ''}`}>
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
            className={styles.searchInput}
            aria-label="Search for items"
          />
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {!loading && !error && !items.length && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyTitle}>No items found</p>
          <p className={styles.emptyDescription}>Try adjusting your search terms</p>
        </div>
      )}

      {items.length > 0 && (
        <div className={styles.listContainer}>
          <List
            rowComponent={Row}
            rowProps={{}}
            rowCount={items.length}
            rowHeight={84}
            style={{ height: 540, width: '100%' }}
          />
        </div>
      )}

      {items.length > 0 && (
        <div className={styles.paginationContainer} role="navigation" aria-label="Pagination">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || loading}
            aria-label="Go to previous page"
            className={`${styles.paginationButton} ${styles.prevButton}`}
          >
            ← Prev
          </button>

          <div className={styles.pageNumbers}>
            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`dots-${idx}`} className={styles.pageDots}>...</span>
                );
              }

              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  className={`${styles.pageButton} ${isActive ? styles.active : ''}`}
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
            className={`${styles.paginationButton} ${styles.primary} ${styles.nextButton}`}
          >
            Next →
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className={styles.paginationInfo} aria-live="polite">
          Showing {((currentPage - 1) * pagination.pageSize) + 1} - {Math.min(currentPage * pagination.pageSize, pagination.total)} of {pagination.total} items
        </div>
      )}
    </div>
  );
}

export default Items;
