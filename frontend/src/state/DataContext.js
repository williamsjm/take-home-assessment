import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0
  });

  const fetchItems = useCallback(async (signal, params = {}) => {
    try {
      const { page = 1, pageSize = 20, search = '' } = params;

      // Build query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });

      if (search) {
        queryParams.append('q', search);
      }

      const res = await fetch(`http://localhost:3001/api/items?${queryParams}`, { signal });
      const json = await res.json();

      // Handle paginated response
      if (json.data) {
        setItems(json.data);
        setPagination({
          total: json.total,
          page: json.page,
          pageSize: json.pageSize,
          totalPages: json.totalPages
        });
      } else {
        // Fallback for non-paginated response
        setItems(json);
      }
    } catch (err) {
      // Ignore abort errors
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch items:', err);
      }
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, pagination, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);