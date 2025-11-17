import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  const location = useLocation();
  const isItemsPage = location.pathname === '/';

  return (
    <DataProvider>
      {/* Premium Navigation */}
      <nav style={{
        padding: '16px 24px',
        borderBottom: '2px solid #e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo/Brand */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(-10deg) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
            }}
            >
              ✨
            </div>
            <span style={{
              fontSize: 18,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #111827 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
              Items Gallery
            </span>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: isItemsPage ? '#ffffff' : '#6366f1',
                backgroundColor: isItemsPage ? '#6366f1' : 'transparent',
                border: `2px solid ${isItemsPage ? '#6366f1' : 'transparent'}`,
                transition: 'all 0.2s ease',
                boxShadow: isItemsPage ? '0 2px 8px rgba(99, 102, 241, 0.25)' : 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (!isItemsPage) {
                  e.currentTarget.style.backgroundColor = '#f0f0ff';
                  e.currentTarget.style.borderColor = '#e0e0ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isItemsPage) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              Browse Items
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content with fade-in */}
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#fafbfc'
      }}>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </div>

      {/* Premium Footer */}
      <footer style={{
        padding: '24px',
        textAlign: 'center',
        borderTop: '2px solid #e5e7eb',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <p style={{
          margin: 0,
          fontSize: 13,
          color: '#6b7280',
          fontWeight: 500
        }}>
          Made with <span style={{ color: '#ef4444' }}>♥</span> for the Take-Home Assessment
        </p>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: 12,
          color: '#9ca3af',
          fontWeight: 500
        }}>
          © 2025 Items Gallery. All rights reserved.
        </p>
      </footer>
    </DataProvider>
  );
}

export default App;
