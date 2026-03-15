import { Navigate } from 'react-router-dom';

/**
 * Wraps protected page routes. 
 * Redirects unauthenticated users to /login.
 */
export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
