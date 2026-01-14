import React, { useState, useEffect } from 'react'
import { FileVideo, ExternalLink, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { callN8N } from '../services/n8n'
import { useNavigate } from 'react-router-dom'

const History = () => {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Webhook ID for fetching tasks
    const HISTORY_WEBHOOK_ID = "c7b04f3d-e624-40ed-9dc5-b67463ff12c8"

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            // Using GET as confirmed
            const data = await callN8N(HISTORY_WEBHOOK_ID, {}, 'GET')
            if (Array.isArray(data)) {
                // Sort by date descending (newest first)
                const sorted = [...data].sort((a, b) =>
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                )
                setTasks(sorted)
            } else {
                // If it returns a single object, wrap it
                setTasks([data])
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

    return (
        <div className="page-container animate-fade-in">
            <header className="page-header">
                <h2>Historial de Generaciones</h2>
            </header>

            {loading && (
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

            {!loading && !error && tasks.length === 0 && (
                <div className="empty-state glass-panel">
                    <p>No hay tareas registradas aún.</p>
                </div>
            )}

            <div className="tasks-list">
                {tasks.map((task, index) => {
                    const status = getStatus(task)
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

                                    {(task.name || task.email) && (
                                        <div className="task-requester">
                                            {task.name && <span className="req-name">{task.name}</span>}
                                            {task.email && <span className="req-email">{task.email}</span>}
                                        </div>
                                    )}

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
