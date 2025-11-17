import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, pagination, fetchItems } = useData();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    // Fetch with pagination params
    fetchItems(controller.signal, { page: currentPage, pageSize: 20 });

    return () => {
      controller.abort();
    };
  }, [fetchItems, currentPage]);

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

  if (!items.length) return <p>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <Link to={'/items/' + item.id}>{item.name}</Link>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
        </span>
        <button onClick={handleNext} disabled={currentPage >= pagination.totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Items;