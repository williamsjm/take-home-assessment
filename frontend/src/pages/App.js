import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import styles from './App.module.css';

function App() {
  const location = useLocation();
  const isItemsPage = location.pathname === '/';

  return (
    <DataProvider>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.brandLink}>
            <div className={styles.logo}>✨</div>
            <span className={styles.brandName}>Items Gallery</span>
          </Link>

          <div className={styles.navLinks}>
            <Link
              to="/"
              className={`${styles.navLink} ${isItemsPage ? styles.active : ''}`}
            >
              Browse Items
            </Link>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Made by{' '}
          <a
            href="https://github.com/williamsjm"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Williams Mejias
          </a>
        </p>
      </footer>
    </DataProvider>
  );
}

export default App;
