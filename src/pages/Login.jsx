import React from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Sparkles } from 'lucide-react'

const Login = ({ onSuccess }) => {
    const login = useGoogleLogin({
        onSuccess: onSuccess,
        onError: () => console.log('Login Failed'),
    });

    return (
        <div className="login-container">
            <div className="glass-panel login-card">
                <div className="logo-area">
                    <div className="logo-icon">
                        <Sparkles size={32} color="white" />
                    </div>
                    <h1>Once App</h1>
                    <p>Genera contenido increíble en segundos.</p>
                </div>

                <button onClick={() => login()} className="btn-google">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="google-icon" />
                    Continuar con Google
                </button>
            </div>

            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
            </div>

            <style>{`
        .login-container {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            padding: 20px;
        }
        .login-card {
            padding: 40px 30px;
            width: 100%;
            max-width: 400px;
            text-align: center;
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
        .logo-area h1 {
            margin-top: 10px;
            font-size: 2.5rem;
        }
        .logo-area p {
            color: var(--text-secondary);
            margin-top: 5px;
        }
        .logo-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
        }
        .btn-google {
            background: white;
            color: #1e293b;
            border: none;
            padding: 14px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: transform 0.2s;
        }
        .btn-google:active {
            transform: scale(0.98);
        }
        .google-icon {
            width: 20px;
            height: 20px;
        }
        .background-shapes .shape {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 1;
        }
        .shape-1 {
            width: 300px;
            height: 300px;
            background: var(--primary-color);
            top: -50px;
            left: -50px;
            opacity: 0.3;
        }
        .shape-2 {
            width: 300px;
            height: 300px;
            background: var(--secondary-color);
            bottom: -50px;
            right: -50px;
            opacity: 0.3;
        }
      `}</style>
        </div>
    )
}

export default Login
