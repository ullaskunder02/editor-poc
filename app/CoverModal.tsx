import React, { useState } from 'react'
import { Upload, Link, X } from 'lucide-react'

interface CoverModalProps {
    isOpen: boolean
    onClose: () => void
    onUploadClick: () => void
    onLinkSubmit: (url: string) => void
}

export default function CoverModal({
    isOpen,
    onClose,
    onUploadClick,
    onLinkSubmit,
}: CoverModalProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload')
    const [imageUrl, setImageUrl] = useState('')

    if (!isOpen) return null

    const handleLinkSubmit = () => {
        if (imageUrl) {
            onLinkSubmit(imageUrl)
            setImageUrl('')
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
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '10vh',
                zIndex: 10000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    width: 500,
                    maxWidth: '90%',
                    borderRadius: 8,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Tabs */}
                <div
                    style={{
                        display: 'flex',
                        borderBottom: '1px solid #e1e1e1',
                        padding: '0 16px',
                    }}
                >
                    <button
                        onClick={() => setActiveTab('upload')}
                        style={{
                            padding: '12px 16px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'upload' ? '2px solid #000' : '2px solid transparent',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 500,
                            color: activeTab === 'upload' ? '#000' : '#666',
                        }}
                    >
                        Upload
                    </button>
                    <button
                        onClick={() => setActiveTab('link')}
                        style={{
                            padding: '12px 16px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'link' ? '2px solid #000' : '2px solid transparent',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 500,
                            color: activeTab === 'link' ? '#000' : '#666',
                        }}
                    >
                        Link
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: 24 }}>
                    {activeTab === 'upload' ? (
                        <div
                            style={{
                                border: '1px dashed #e1e1e1',
                                borderRadius: 8,
                                padding: 40,
                                textAlign: 'center',
                                background: '#fcfcfc',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onClick={onUploadClick}
                            onMouseOver={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                            onMouseOut={(e) => (e.currentTarget.style.background = '#fcfcfc')}
                        >
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: '#f0f0f0',
                                    marginBottom: 16,
                                }}
                            >
                                <Upload size={24} color="#666" />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
                                Upload an image
                            </div>
                            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                                Recommended size: 1500px wide
                            </div>
                            <button
                                style={{
                                    marginTop: 16,
                                    padding: '6px 12px',
                                    background: '#2eaadc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 4,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Choose file
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <input
                                    type="text"
                                    placeholder="Paste an image link..."
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        border: '1px solid #e1e1e1',
                                        borderRadius: 4,
                                        fontSize: 14,
                                        outline: 'none',
                                    }}
                                    autoFocus
                                />
                                <button
                                    onClick={handleLinkSubmit}
                                    disabled={!imageUrl}
                                    style={{
                                        padding: '8px 16px',
                                        background: imageUrl ? '#2eaadc' : '#f5f5f5',
                                        color: imageUrl ? 'white' : '#aaa',
                                        border: 'none',
                                        borderRadius: 4,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        cursor: imageUrl ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 12 }}>
                                Works with any image from the web.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
