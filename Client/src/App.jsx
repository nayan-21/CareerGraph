import { useState, useRef } from 'react';
import './index.css';
import UploadForm from './components/UploadForm';
import JobForm from './components/JobForm';
import ResultsPanel from './components/ResultsPanel';

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
    // ─── Core State ──────────────────────────────────
    const [resumeId, setResumeId] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analysisData, setAnalysisData] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzeError, setAnalyzeError] = useState('');

    // Auto-scroll target
    const resultsRef = useRef(null);

    // ─── Handler: Resume Upload Success ──────────────
    const handleUploadSuccess = (id) => {
        setResumeId(id);
        setAnalysisData(null); // Clear old results when a new resume is uploaded
        setAnalyzeError('');
    };

    // ─── Handler: Analyze ────────────────────────────
    const handleAnalyze = async () => {
        if (!resumeId || !jobDescription.trim()) return;

        setAnalyzing(true);
        setAnalyzeError('');

        try {
            const res = await fetch(`${API_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId, jobDescription })
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Analysis failed. Please try again.');
            }

            setAnalysisData(json.data);

            // Safeguard 6: Smooth scroll to results
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

        } catch (err) {
            setAnalyzeError(err.message || 'Server error during analysis.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="app">
            {/* ─── Header ─── */}
            <header className="app-header">
                <h1>CareerGraph</h1>
                <p>AI-powered resume analysis and job match scoring</p>
            </header>

            {/* ─── Step 1: Upload ─── */}
            <UploadForm onUploadSuccess={handleUploadSuccess} />

            {/* ─── Step 2: Job Description + Analyze ─── */}
            <JobForm
                resumeId={resumeId}
                loading={analyzing}
                onAnalyze={{
                    run: handleAnalyze,
                    setJobDescription
                }}
            />

            {/* ─── Analyze Error ─── */}
            {analyzeError && (
                <div className="error-banner" style={{ marginBottom: 16 }}>
                    ⚠️ {analyzeError}
                </div>
            )}

            {/* ─── Step 3: Results ─── */}
            <div ref={resultsRef}>
                <ResultsPanel data={analysisData} />
            </div>
        </div>
    );
}
