import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../services/auth';

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                CareerGraph
            </Link>

            <div className="navbar-links">
                {token ? (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/upload" className="nav-link">Upload Resume</Link>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link nav-link-accent">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
