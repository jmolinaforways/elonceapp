import React from 'react'
import { Home, Image, Settings, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Layout = ({ children, user, onLogout }) => {
    const location = useLocation()

    return (
        <div className="app-layout">
            <header className="app-header glass-panel">
                <div className="user-info">
                    {user.picture ? (
                        <img src={user.picture} alt="User" className="user-avatar" />
                    ) : (
                        <div className="user-avatar-placeholder">{user.given_name?.[0] || 'U'}</div>
                    )}
                    <span className="user-name">Hola, {user.given_name || 'Creator'}</span>
                </div>
                <button onClick={onLogout} className="icon-btn">
                    <LogOut size={20} color="#94a3b8" />
                </button>
            </header>

            <main className="app-content">
                {children}
            </main>

            <nav className="bottom-nav glass-panel">
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>Inicio</span>
                </Link>
                <Link to="/history" className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
                    <Image size={24} />
                    <span>Generado</span>
                </Link>
                <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
                    <Settings size={24} />
                    <span>Ajustes</span>
                </Link>
            </nav>

            <style>{`
            .app-layout {
                display: flex;
                flex-direction: column;
                height: 100vh;
                width: 100%;
                /* Constrain width on large screens */
                /* max-width: 600px; REMOVED to allow full width usage if needed, but for mobile app feel center it */
                max-width: 100%; 
                margin: 0 auto;
                background: #0f172a;
                position: relative;
            }
            @media (min-width: 768px) {
                .app-layout {
                    max-width: 480px; /* Mobile App View on Desktop */
                    border-left: 1px solid rgba(255,255,255,0.05);
                    border-right: 1px solid rgba(255,255,255,0.05);
                }
            }

            .app-header {
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 16px;
                margin: 16px 16px 0;
                z-index: 10;
            }
            .user-info {
                display: flex;
                align-items: center;
                gap: 12px;
                font-weight: 600;
                color: var(--text-primary);
            }
            .user-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 2px solid var(--primary-color);
                object-fit: cover;
            }
            .user-avatar-placeholder {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }
            .icon-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .app-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                padding-bottom: 100px; /* Space for bottom nav */
                scrollbar-width: none; /* Hide scrollbar for cleaner look */
            }
            .app-content::-webkit-scrollbar {
                display: none;
            }

            .bottom-nav {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: calc(100% - 32px);
                max-width: 448px; /* Match media query max width - padding */
                height: 70px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                z-index: 100;
            }
            .nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-decoration: none;
                color: var(--text-secondary);
                font-size: 0.75rem;
                gap: 6px;
                transition: all 0.2s;
                position: relative;
            }
            .nav-item.active {
                color: var(--primary-color);
            }
            .nav-item.active::after {
                content: '';
                position: absolute;
                bottom: -15px; /* adjust based on nav height */
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                box-shadow: 0 0 10px var(--primary-color);
            }
        `}</style>
        </div>
    )
}

export default Layout
