import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

  // Premium loading skeleton
  if (loading) {
    return (
      <div style={{
        padding: '32px 24px',
        maxWidth: 700,
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{
          height: 40,
          width: '40%',
          marginBottom: 24,
          borderRadius: 12,
          background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
        <div style={{
          height: 200,
          borderRadius: 16,
          background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          marginBottom: 20
        }} />
        <div style={{
          height: 24,
          width: '60%',
          borderRadius: 8,
          background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          marginBottom: 12
        }} />
        <div style={{
          height: 24,
          width: '50%',
          borderRadius: 8,
          background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
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
  }

  if (!item) return null;

  return (
    <div style={{
      padding: '32px 24px',
      maxWidth: 700,
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Back button with premium styling */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          marginBottom: 24,
          backgroundColor: '#ffffff',
          border: '2px solid #e5e7eb',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          color: '#6366f1',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#6366f1';
          e.currentTarget.style.transform = 'translateX(-4px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
        }}
      >
        <span style={{ fontSize: 16 }}>←</span>
        Back to Items
      </button>

      {/* Premium card container */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        border: '2px solid #e5e7eb',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        animation: 'fadeIn 0.4s ease-out'
      }}>
        {/* Header section with gradient background */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          padding: '32px 28px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }} />

          {/* Item icon badge */}
          <div style={{
            width: 70,
            height: 70,
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 700,
            color: '#6366f1',
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            zIndex: 1
          }}>
            {item.name.charAt(0).toUpperCase()}
          </div>

          {/* Item name */}
          <h1 style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.3,
            position: 'relative',
            zIndex: 1
          }}>
            {item.name}
          </h1>
        </div>

        {/* Content section */}
        <div style={{ padding: '28px' }}>
          {/* Category badge */}
          {item.category && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              backgroundColor: '#f0f0ff',
              border: '2px solid #e0e0ff',
              borderRadius: 10,
              marginBottom: 24
            }}>
              <span style={{ fontSize: 16 }}>📦</span>
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#6366f1'
              }}>
                {item.category}
              </span>
            </div>
          )}

          {/* Price section */}
          <div style={{
            padding: '24px',
            backgroundColor: '#fafbfc',
            borderRadius: 14,
            border: '2px dashed #e5e7eb',
            marginBottom: 24
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#6b7280',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Price
            </div>
            <div style={{
              fontSize: 36,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #111827 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ${item.price}
            </div>
          </div>

          {/* Additional details */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: 12,
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#9ca3af',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Item Details
            </div>
            <div style={{
              display: 'grid',
              gap: 10
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                color: '#374151'
              }}>
                <span style={{ fontWeight: 500 }}>Item ID:</span>
                <span style={{ fontWeight: 600, color: '#6366f1' }}>#{item.id}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                color: '#374151'
              }}>
                <span style={{ fontWeight: 500 }}>Status:</span>
                <span style={{
                  fontWeight: 600,
                  color: '#10b981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'inline-block'
                  }} />
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default ItemDetail;
