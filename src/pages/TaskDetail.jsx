import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Download, ExternalLink } from 'lucide-react'

const TaskDetail = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const task = location.state?.task
    const [copied, setCopied] = useState('')

    // Redirect if no task data (e.g. direct access without state)
    if (!task) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '40px' }}>
                <p>No se encontró la información de la tarea.</p>
                <button onClick={() => navigate('/history')} className="btn-secondary" style={{ marginTop: '20px' }}>
                    Volver al Historial
                </button>
            </div>
        )
    }

    const handleCopy = (text, type) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(''), 2000)
    }

    // State to manage current image source and error state
    const [imgSrc, setImgSrc] = useState(null)
    const [imgError, setImgError] = useState(false)

    // Helper to get High Res URL
    const getDirectDriveUrl = (url) => {
        if (!url) return null
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
        if (match && match[1]) {
            // Use the Google CDN link format which is most reliable for direct image embedding
            // format: https://lh3.googleusercontent.com/d/{FILE_ID}=w{WIDTH}
            return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`
        }
        return url
    }

    // Initialize image source on mount or task change
    React.useEffect(() => {
        if (task) {
            // Use our own proxy to fetch the image "locally"
            // We behave as if we are downloading it to the app
            if (task.miniatura_web) {
                setImgSrc(`/api/proxy?url=${encodeURIComponent(task.miniatura_web)}`)
            } else if (task.portada_link) {
                setImgSrc(`/api/proxy?url=${encodeURIComponent(task.portada_link)}`)
            }
            setImgError(false)
        }
    }, [task])

    const handleImgError = () => {
        // If the proxy fails for miniatura, try proxying the high res link as backup
        // encodeURIComponent is crucial for passing url as param
        if (task.miniatura_web && imgSrc.includes(encodeURIComponent(task.miniatura_web)) && task.portada_link) {
            setImgSrc(`/api/proxy?url=${encodeURIComponent(task.portada_link)}`)
        } else {
            setImgError(true)
        }
    }

    return (
        <div className="task-detail-container animate-fade-in">
            {/* Header / Navbar */}
            <div className="detail-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <span className="header-title">Detalles</span>
            </div>

            {/* Media Area */}
            <div className="media-area">
                {!imgError && imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={task.titulo}
                        className="media-image"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={handleImgError}
                    />
                ) : (
                    <div className="media-placeholder">
                        <p>Vista previa no disponible</p>
                        {/* Fallback link if image fails to load so user can still see it */}
                        {task.portada_link && (
                            <a href={task.portada_link} target="_blank" rel="noopener noreferrer" style={{ marginTop: '10px', color: 'var(--primary-color)' }}>
                                Abrir en Drive
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="content-area">
                {/* Title Section */}
                <div className="info-block">
                    <div className="title-row">
                        <h1 className="video-title">{task.titulo || 'Sin Título'}</h1>
                        <button
                            className="icon-btn"
                            onClick={() => handleCopy(task.titulo, 'title')}
                            aria-label="Copiar Título"
                        >
                            {copied === 'title' ? <Check size={20} color="#10b981" /> : <Copy size={20} />}
                        </button>
                    </div>
                    <div className="meta-row">
                        <span className="date">{new Date(task.createdAt || Date.now()).toLocaleDateString()}</span>
                        {task.prompt && <span className="view-count">• Prompt: "{task.prompt.substring(0, 30)}..."</span>}
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="actions-bar hide-scrollbar">
                    {task.drive_link && (
                        <a href={task.drive_link} target="_blank" rel="noopener noreferrer" className="action-chip">
                            <Download size={18} />
                            <span>Carpeta Drive</span>
                        </a>
                    )}

                    {/* Botón para descargar la imagen directamente */}
                    {task.portada_link && (
                        <a
                            href={getDirectDriveUrl(task.portada_link)}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-chip"
                        >
                            <ExternalLink size={18} />
                            <span>Ver Original (HD)</span>
                        </a>
                    )}


                </div>

                {/* Description Box */}
                <div className="description-box">
                    <div className="desc-header">
                        <h3>Descripción / Texto</h3>
                        <button
                            onClick={() => handleCopy(task.texto || task.descripcion, 'desc')}
                            className="copy-text-btn"
                        >
                            {copied === 'desc' ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                    <div className="desc-content">
                        {task.texto || task.descripcion || 'Sin descripción disponible para esta tarea.'}
                    </div>
                </div>

                {/* Full Prompt if available */}
                {task.prompt && (
                    <div className="description-box" style={{ marginTop: '16px' }}>
                        <div className="desc-header">
                            <h3>Prompt Original</h3>
                        </div>
                        <div className="desc-content">
                            {task.prompt}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .task-detail-container {
                    padding-bottom: 40px;
                    /* background: var(--background); Remove background to blend or keep if needed. */
                }
                .detail-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    border-bottom: 1px solid var(--border-color);
                }
                .back-btn {
                    background: none;
                    border: none;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: 8px;
                    margin-left: -8px; /* Optical alignment */
                }
                .header-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                .media-area {
                    width: 100%;
                    /* Use max-height to prevent it from taking over the whole screen on tall images */
                    max-height: 60vh; 
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .media-image {
                    width: 100%;
                    height: auto;
                    max-height: 60vh;
                    object-fit: contain;
                }
                .media-placeholder {
                    color: var(--text-secondary);
                }
                .content-area {
                    padding: 16px;
                }
                .title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 8px;
                }
                .video-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    line-height: 1.3;
                    margin: 0;
                    color: white;
                    flex: 1;
                }
                .icon-btn {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                }
                .icon-btn:active {
                    background: rgba(255,255,255,0.2);
                }
                .meta-row {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-bottom: 16px;
                }
                .actions-bar {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding-bottom: 16px;
                    margin-bottom: 16px;
                    border-bottom: 1px solid var(--border-color);
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .action-chip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.08);
                    padding: 8px 16px;
                    border-radius: 18px;
                    color: white;
                    text-decoration: none;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    font-weight: 500;
                }
                .action-chip:active {
                    background: rgba(255,255,255,0.15);
                }
                .description-box {
                    background: rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 12px;
                }
                .desc-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .desc-header h3 {
                    margin: 0;
                    font-size: 0.95rem;
                    color: white;
                }
                .copy-text-btn {
                    background: none;
                    border: none;
                    color: var(--primary-color);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .desc-content {
                    font-size: 0.95rem;
                    line-height: 1.5;
                    color: var(--text-secondary);
                    white-space: pre-wrap;
                }
            `}</style>
        </div>
    )
}

export default TaskDetail
