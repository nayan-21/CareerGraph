import { useState, useRef } from 'react';
import UploadForm from '../components/UploadForm';
import JobForm from '../components/JobForm';
import ResultsPanel from '../components/ResultsPanel';

export default function Dashboard() {
    const [resumeId, setResumeId] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analysisData, setAnalysisData] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzeError, setAnalyzeError] = useState('');

    const resultsRef = useRef(null);

    const handleUploadSuccess = (id) => {
        setResumeId(id);
        setAnalysisData(null);
        setAnalyzeError('');
    };

    const handleAnalyze = async () => {
        if (!resumeId || !jobDescription.trim()) return;

        setAnalyzing(true);
        setAnalyzeError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ resumeId, jobDescription })
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Analysis failed. Please try again.');
            }

            setAnalysisData(json.data);

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
            <UploadForm onUploadSuccess={handleUploadSuccess} />

            <JobForm
                resumeId={resumeId}
                loading={analyzing}
                onAnalyze={{ run: handleAnalyze, setJobDescription }}
            />

            {analyzeError && (
                <div className="error-banner" style={{ marginBottom: 16 }}>
                    ⚠️ {analyzeError}
                </div>
            )}

            <div ref={resultsRef}>
                <ResultsPanel data={analysisData} />
            </div>
        </div>
    );
}
