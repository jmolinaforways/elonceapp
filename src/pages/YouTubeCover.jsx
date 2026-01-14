import React, { useState } from 'react'
import { ArrowLeft, Wand2, Link as LinkIcon, Download, ExternalLink, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { callN8N } from '../services/n8n'

const YouTubeCover = () => {
    const navigate = useNavigate()
    const [url, setUrl] = useState('')
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')

    // Webhook URL from requirements
    const WEBHOOK_ID = "aa5bcefa-cf47-404f-a9e9-637db5c98975"

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)
        setError('')
        setResult(null)

        try {
            // Using GET as verified
            // The endpoint now triggers a potentially long process
            await callN8N(WEBHOOK_ID, { url, prompt }, 'GET')

            // Immediately show success/processing message without waiting for the image
            setResult({
                processing: true
            })

        } catch (err) {
            setError('Hubo un error al iniciar la generación. Inténtalo de nuevo.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-container animate-fade-in">
            <header className="page-header">
                <button onClick={() => navigate('/')} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h2>Portada YouTube</h2>
            </header>

            <div className="content">
                <div className="glass-panel input-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="input-label">URL del Video</label>
                            <div className="input-group">
                                <LinkIcon size={20} className="input-icon" />
                                <input
                                    type="url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="input-field-with-icon"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="input-label">Instrucciones (Prompt)</label>
                            <div className="input-group">
                                <Wand2 size={20} className="input-icon" style={{ top: '20px' }} />
                                <textarea
                                    placeholder="Ej: Hazla muy colorida, estilo minimalista, enfócate en la cara..."
                                    className="input-field-with-icon textarea-field"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows="3"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <>Iniciando...</>
                            ) : (
                                <>
                                    <Wand2 size={20} />
                                    Generar Portada
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="error-message glass-panel">
                        {error}
                    </div>
                )}

                {result && result.processing && (
                    <div className="result-card glass-panel animate-fade-in processing-card">
                        <div className="processing-icon">
                            <Clock size={48} className="spin-slow" />
                        </div>
                        <h3>¡Solicitud Recibida!</h3>
                        <p>Tu portada se está procesando en nuestros servidores.</p>
                        <p className="note">Este proceso puede tardar hasta 15 minutos.</p>
                        <p className="note">Puedes ver el estado en la sección de Historial.</p>

                        <button onClick={() => navigate('/history')} className="btn-secondary mt-4">
                            Ir al Historial
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .page-container {
                    padding-bottom: 20px;
                }
                .page-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .back-btn {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .back-btn:active {
                    background: rgba(255,255,255,0.1);
                }
                .input-card {
                    padding: 24px;
                    margin-bottom: 20px;
                }
                .input-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
                .input-group {
                    position: relative;
                    margin-bottom: 20px;
                }
                .input-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                }
                .textarea-field {
                    resize: vertical;
                    min-height: 80px;
                    font-family: inherit;
                }
                .form-group {
                    margin-bottom: 24px;
                }
                .input-field-with-icon {
                    width: 100%;
                    padding: 12px 16px 12px 42px;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                }
                .input-field-with-icon:focus {
                    border-color: var(--primary-color);
                }
                .error-message {
                    padding: 16px;
                    background: rgba(239, 68, 68, 0.2);
                    border-color: rgba(239, 68, 68, 0.5);
                    color: #fca5a5;
                    margin-bottom: 20px;
                }
                .result-card {
                    padding: 30px 20px;
                    text-align: center;
                }
                .processing-card h3 {
                    color: var(--primary-color);
                    margin-bottom: 12px;
                    font-size: 1.5rem;
                }
                .processing-card p {
                    color: var(--text-primary);
                    margin-bottom: 8px;
                }
                .processing-card .note {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                .processing-icon {
                    margin-bottom: 20px;
                    color: var(--primary-color);
                    display: flex;
                    justify-content: center;
                }
                .spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .mt-4 {
                    margin-top: 24px;
                    width: 100%;
                }
                .btn-secondary {
                    padding: 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background 0.2s;
                }
                .btn-secondary:active {
                    background: rgba(255,255,255,0.1);
                }
            `}</style>
        </div>
    )
}

export default YouTubeCover
