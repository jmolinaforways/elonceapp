import React, { useState, useEffect } from 'react'
import { FileVideo, ExternalLink, Download, Clock, CheckCircle, AlertCircle, Search, RefreshCw, Trash } from 'lucide-react'
import { callN8N } from '../services/n8n'
import { useNavigate } from 'react-router-dom'

const History = () => {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Webhook ID for fetching tasks
    const HISTORY_WEBHOOK_ID = "c7b04f3d-e624-40ed-9dc5-b67463ff12c8"

    useEffect(() => {
        fetchTasks()
    }, [])

    useEffect(() => {
        // Filter tasks when searchTerm or tasks change
        if (!searchTerm.trim()) {
            setFilteredTasks(tasks)
        } else {
            const lowerTerm = searchTerm.toLowerCase()
            const filtered = tasks.filter(task => {
                const vidId = getVideoId(task.video || task.video_url || task.url);
                return (
                    (task.titulo && task.titulo.toLowerCase().includes(lowerTerm)) ||
                    (task.name && task.name.toLowerCase().includes(lowerTerm)) ||
                    (task.email && task.email.toLowerCase().includes(lowerTerm)) ||
                    (task.texto && task.texto.toLowerCase().includes(lowerTerm)) ||
                    (task.descripcion && task.descripcion.toLowerCase().includes(lowerTerm)) ||
                    (task.prompt && task.prompt.toLowerCase().includes(lowerTerm)) ||
                    (vidId && vidId.toLowerCase().includes(lowerTerm))
                )
            })
            setFilteredTasks(filtered)
        }
    }, [searchTerm, tasks])

    const fetchTasks = async () => {
        setLoading(true)
        setError('')
        try {
            // Using GET as confirmed
            const data = await callN8N(HISTORY_WEBHOOK_ID, {}, 'GET')
            if (Array.isArray(data)) {
                // Sort by date descending (newest first)
                const sorted = [...data].sort((a, b) =>
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                )
                setTasks(sorted)
                setFilteredTasks(sorted)
            } else {
                // If it returns a single object, wrap it
                setTasks([data])
                setFilteredTasks([data])
            }
        } catch (err) {
            console.error(err)
            setError('No se pudieron cargar las tareas.')
        } finally {
            setLoading(false)
        }
    }

    const getStatus = (task) => {
        if (task.drive_link || task.portada_link) return 'completed'
        if (task.error) return 'error'
        return 'pending'
    }

    // Helper to extract Video ID
    const getVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Delete a task by raw video parameter using N8N webhook
    const handleDelete = async (video) => {
        if (!video) return;
        try {
            // Send the raw video value as the 'id' query parameter (GET)
            await callN8N('0078c759-9211-461a-8928-0b9852e4967a', { id: video }, 'GET');
            fetchTasks();
            // Show success alert
            window.alert('✅ Tarea eliminada correctamente');
        } catch (err) {
            console.error('Error deleting task', err);
            // Show error alert
            window.alert('❌ Error al eliminar la tarea');
        }
    };

    return (
        <div className="page-container animate-fade-in">
            <header className="page-header">
                <div className="header-row">
                    <h2>Historial</h2>
                    <button onClick={fetchTasks} className="refresh-btn" disabled={loading}>
                        <RefreshCw size={20} className={loading ? 'spinning' : ''} />
                    </button>
                </div>
                <div className="search-bar glass-panel">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por título, usuario o prompt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            {loading && tasks.length === 0 && ( /* Only show full page loading if no tasks yet */
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando tareas...</p>
                </div>
            )}

            {error && (
                <div className="error-message glass-panel">
                    {error}
                    <button onClick={fetchTasks} className="retry-btn">Reintentar</button>
                </div>
            )}

            {!loading && !error && filteredTasks.length === 0 && (
                <div className="empty-state glass-panel">
                    {searchTerm ? (
                        <p>No se encontraron resultados para "{searchTerm}"</p>
                    ) : (
                        <p>No hay tareas registradas aún.</p>
                    )}
                </div>
            )}

            <div className="tasks-list">
                {filteredTasks.map((task, index) => {
                    const status = getStatus(task)
                    const videoId = getVideoId(task.video); // video field only

                    return (
                        <div
                            key={index}
                            className="glass-panel task-card"
                            onClick={() => navigate('/history/detail', { state: { task } })}
                        >
                            <div className="task-header">
                                <div className="task-icon-area">
                                    {task.miniatura_web ? (
                                        <img src={task.miniatura_web} alt="Thumb" className="task-thumb" referrerPolicy="no-referrer" />
                                    ) : (
                                        <FileVideo size={20} color="#fff" />
                                    )}
                                </div>
                                <div className="task-info">
                                    <h4 className="task-title">{task.titulo || 'Portada YouTube'}</h4>

                                    <div className="task-subinfo">
                                        {videoId && <span className="video-id">ID: {videoId}</span>}
                                        {task.video && <span className="video-raw">{task.video}</span>}
                                        {(task.name || task.email) && (
                                            <span className="task-requester">
                                                • {task.name ? `${task.name} (${task.email})` : task.email}
                                            </span>
                                        )}
                                    </div>

                                    <span className="click-hint">Ver detalles</span>
                                </div>
                                <div className={`status-badge ${status}`}>
                                    {status === 'completed' && <CheckCircle size={14} />}
                                    {status === 'pending' && <Clock size={14} />}
                                    {status === 'error' && <AlertCircle size={14} />}
                                </div>
                            </div>

                            {/* Actions if completed */}
                            {status === 'completed' && (
                                <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                                    {task.drive_link && (
                                        <a href={task.drive_link} target="_blank" rel="noopener noreferrer" className="action-btn">
                                            <Download size={16} /> Drive
                                        </a>
                                    )}
                                    {/* Delete button with confirmation */}
                                    <a href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
                                                handleDelete(task.video);
                                            }
                                        }}
                                        className="action-btn"
                                        title="Eliminar"
                                    >
                                        <Trash size={16} />
                                    </a>
                                </div>
                            )}
                            {/* Timestamp if available */}
                            {task.createdAt && (
                                <div className="task-footer">
                                    {new Date(task.createdAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <style>{`
                .page-header {
                    margin-bottom: 20px;
                }
                .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .refresh-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .refresh-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }
                .refresh-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .spinning {
                    animation: spin 1s linear infinite;
                }

                .task-subinfo {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-wrap: wrap;
                    margin-bottom: 4px;
                    font-size: 0.75rem;
                }
                .video-id {
                    font-family: monospace;
                    background: rgba(255,255,255,0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: var(--primary-color);
                    font-size: 0.7rem;
                }
                .task-requester {
                    color: var(--text-secondary);
                }
                
                /* Keep previous search bar styles */
                .search-bar {
                    display: flex;
                    align-items: center;
                    padding: 4px 12px;
                    margin-top: 12px;
                    border-radius: 8px;
                }
                .search-icon {
                    color: var(--text-secondary);
                    margin-right: 8px;
                }
                .search-input {
                    background: none;
                    border: none;
                    color: white;
                    padding: 8px 0;
                    width: 100%;
                    outline: none;
                    font-size: 0.95rem;
                }
                .search-input::placeholder {
                    color: var(--text-secondary);
                    opacity: 0.6;
                }
                .loading-state {
                    text-align: center;
                    padding: 40px;
                    color: var(--text-secondary);
                }
                .spinner {
                    width: 30px;
                    height: 30px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                    border-top-color: var(--primary-color);
                    animation: spin 1s linear infinite;
                    margin: 0 auto 10px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .retry-btn {
                    margin-left: 10px;
                    background: none;
                    border: 1px solid var(--text-secondary);
                    color: var(--text-secondary);
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .tasks-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .task-card {
                    padding: 16px;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                }
                .task-card:active {
                    transform: scale(0.98);
                    background: rgba(255,255,255,0.08);
                }
                .task-header {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }
                .task-icon-area {
                    width: 60px;
                    height: 45px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    overflow: hidden;
                }
                .task-thumb {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .task-info {
                    flex: 1;
                    min-width: 0; /* Text truncation fix */
                }
                .task-title {
                    font-size: 1rem;
                    margin-bottom: 4px;
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .click-hint {
                    font-size: 0.7rem;
                    color: var(--primary-color);
                    margin-top: 4px;
                    display: inline-block;
                }
                .task-requester {
                    display: flex;
                    flex-direction: column;
                    font-size: 0.75rem;
                    margin-bottom: 4px;
                }
                .req-name {
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .req-email {
                    color: var(--text-secondary);
                    opacity: 0.7;
                    font-size: 0.7rem;
                }
                .status-badge {
                    padding: 4px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .status-badge.completed { color: #10b981; background: rgba(16, 185, 129, 0.2); }
                .status-badge.pending { color: #f59e0b; background: rgba(245, 158, 11, 0.2); }
                .status-badge.error { color: #ef4444; background: rgba(239, 68, 68, 0.2); }

                .task-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid var(--border-color);
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: var(--text-primary);
                    text-decoration: none;
                    background: rgba(255,255,255,0.05);
                    padding: 6px 12px;
                    border-radius: 6px;
                    transition: background 0.2s;
                }
                .action-btn:active {
                    background: rgba(255,255,255,0.1);
                }
                .task-footer {
                    margin-top: 8px;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-align: right;
                }
            `}</style>
        </div>
    )
}

export default History
