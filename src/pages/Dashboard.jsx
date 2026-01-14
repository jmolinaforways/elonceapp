import React from 'react'
import { Youtube, Instagram, FileText, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ActionCard = ({ icon: Icon, title, description, color, onClick }) => (
    <button className="glass-panel action-card" onClick={onClick}>
        <div className="icon-wrapper" style={{ background: color }}>
            <Icon size={24} color="white" />
        </div>
        <div className="card-content">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    </button>
)

const Dashboard = ({ user }) => {
    const navigate = useNavigate()

    // Placeholder actions
    const actions = [
        {
            icon: Youtube,
            title: 'Portada YouTube',
            description: 'Genera miniaturas clickbait',
            color: 'linear-gradient(135deg, #FF0000, #FF5555)',
            onClick: () => navigate('/youtube-cover')
        },
        // {
        //     icon: Instagram,
        //     title: 'Post Instagram',
        //     description: 'Carruseles y Stories',
        //     color: 'linear-gradient(135deg, #833AB4, #FD1D1D, #FCAF45)',
        //     onClick: () => alert('Ir a generador de Instagram')
        // },
        // {
        //     icon: FileText,
        //     title: 'Generar Copy',
        //     description: 'Textos persuasivos con IA',
        //     color: 'linear-gradient(135deg, #3B82F6, #10B981)',
        //     onClick: () => alert('Ir a generador de Copy')
        // },
        // {
        //     icon: Zap,
        //     title: 'Idea Viral',
        //     description: 'Brainstorming automático',
        //     color: 'linear-gradient(135deg, #F59E0B, #D97706)',
        //     onClick: () => alert('Ir a generador de Ideas')
        // }
    ]

    return (
        <div className="dashboard-container animate-fade-in">
            <section className="welcome-section">
                <h2>¿Qué vamos a crear hoy?</h2>
                <p>Selecciona una herramienta para empezar.</p>
            </section>

            <div className="actions-grid">
                {actions.map((action, index) => (
                    <ActionCard key={index} {...action} />
                ))}
            </div>

            <style>{`
            .welcome-section {
                margin-bottom: 24px;
            }
            .welcome-section h2 {
                margin-bottom: 8px;
            }
            .welcome-section p {
                color: var(--text-secondary);
                font-size: 0.95rem;
            }
            .actions-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            /* Action Card Styles */
            .action-card {
                display: flex;
                align-items: center;
                padding: 16px;
                text-align: left;
                width: 100%;
                transition: transform 0.2s, background 0.2s;
                cursor: pointer;
            }
            .action-card:active {
                transform: scale(0.98);
                background: rgba(30, 41, 59, 0.9);
            }
            .icon-wrapper {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 16px;
                flex-shrink: 0;
            }
            .card-content h3 {
                font-size: 1.1rem;
                margin-bottom: 4px;
                color: var(--text-primary);
            }
            .card-content p {
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
        `}</style>
        </div>
    )
}

export default Dashboard
