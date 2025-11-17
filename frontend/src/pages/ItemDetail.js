import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ItemDetail.module.css';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/');
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className={styles.loadingSkeleton}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonCard} />
        <div className={`${styles.skeletonLine} ${styles.width60}`} />
        <div className={`${styles.skeletonLine} ${styles.width50}`} />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        <span>←</span>
        Back to Items
      </button>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.decorativeCircle1} />
          <div className={styles.decorativeCircle2} />

          <div className={styles.itemIconBadge}>
            {item.name.charAt(0).toUpperCase()}
          </div>

          <h1 className={styles.itemTitle}>{item.name}</h1>
        </div>

        <div className={styles.cardContent}>
          {item.category && (
            <div className={styles.categoryBadge}>
              <span>📦</span>
              <span className={styles.categoryText}>{item.category}</span>
            </div>
          )}

          <div className={styles.priceSection}>
            <div className={styles.priceLabel}>Price</div>
            <div className={styles.priceValue}>${item.price}</div>
          </div>

          <div className={styles.detailsSection}>
            <div className={styles.detailsTitle}>Item Details</div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Item ID:</span>
                <span className={`${styles.detailValue} ${styles.itemId}`}>#{item.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status:</span>
                <span className={`${styles.detailValue} ${styles.status}`}>
                  <span className={styles.statusDot} />
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
