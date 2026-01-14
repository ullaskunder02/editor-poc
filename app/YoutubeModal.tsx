import React, { useState, useEffect } from 'react'
import { X, Link, Clock } from 'lucide-react'

interface YoutubeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string, start: string, end: string) => void
}

export default function YoutubeModal({
  isOpen,
  onClose,
  onSubmit,
}: YoutubeModalProps) {
  const [ytUrl, setYtUrl] = useState('')
  const [ytStart, setYtStart] = useState('')
  const [ytEnd, setYtEnd] = useState('')

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setYtUrl('')
      setYtStart('')
      setYtEnd('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (ytUrl) {
      onSubmit(ytUrl, ytStart, ytEnd)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          padding: 24,
          borderRadius: 16,
          width: 420,
          maxWidth: '90%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          border: '1px solid #eee',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20,
            alignItems: 'center',
          }}
        >
          <h3
            style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111' }}
          >
            Embed YouTube Video
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '50%',
              padding: 6,
              display: 'flex',
            }}
          >
            <X size={18} color="#666" />
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 13,
              fontWeight: 500,
              color: '#555',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link size={14} /> Video URL
            </div>
          </label>
          <input
            type="text"
            placeholder="Paste YouTube link here..."
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e1e1e1',
              borderRadius: 8,
              fontSize: 14,
              background: '#fcfcfc',
              color: '#111',
              outline: 'none',
            }}
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 500,
                color: '#555',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> Start Time (seconds)
              </div>
            </label>
            <input
              type="number"
              placeholder="0"
              value={ytStart}
              onChange={(e) => setYtStart(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e1e1e1',
                borderRadius: 8,
                fontSize: 14,
                background: '#fcfcfc',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 500,
                color: '#555',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> End Time (seconds)
              </div>
            </label>
            <input
              type="number"
              placeholder="Optional"
              value={ytEnd}
              onChange={(e) => setYtEnd(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e1e1e1',
                borderRadius: 8,
                fontSize: 14,
                background: '#fcfcfc',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            paddingTop: 10,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #e1e1e1',
              background: 'white',
              cursor: 'pointer',
              fontSize: 14,
              color: '#555',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!ytUrl}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              background: ytUrl ? '#000' : '#e5e5e5',
              color: 'white',
              cursor: ytUrl ? 'pointer' : 'not-allowed',
              fontSize: 14,
              fontWeight: 600,
              transition: 'background 0.2s',
            }}
          >
            Embed Video
          </button>
        </div>
      </div>
    </div>
  )
}
