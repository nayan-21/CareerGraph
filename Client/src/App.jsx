import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import UploadForm from './components/UploadForm';
import ResultsPanel from './components/ResultsPanel';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/upload" element={
                    <ProtectedRoute><div className="app"><UploadForm onUploadSuccess={() => {}} /></div></ProtectedRoute>
                } />
                <Route path="/analyze" element={
                    <ProtectedRoute><div className="app"><ResultsPanel data={null} /></div></ProtectedRoute>
                } />

                {/* Root redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
