import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function UploadForm({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadData, setUploadData] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
            setError('');
            setUploadData(null);
        } else {
            setError('Please select a valid PDF file.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Upload failed.');
            }

            setUploadData(json.data);
            onUploadSuccess(json.data.resumeId); // Bubble up resumeId to App

        } catch (err) {
            setError(err.message || 'Something went wrong during upload.');
        } finally {
            setLoading(false);
        }
    };

    const matchClass = (score) => {
        if (score === undefined) return '';
        if (score >= 70) return 'high';
        if (score >= 40) return 'mid';
        return 'low';
    };

    return (
        <div className="card">
            <div className="card-title">
                <span className="step-badge">STEP 1</span>
                Upload Your Resume
            </div>

            <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const dropped = e.dataTransfer.files[0];
                    if (dropped?.type === 'application/pdf') {
                        setFile(dropped);
                        setError('');
                        setUploadData(null);
                    } else {
                        setError('Only PDF files are accepted.');
                    }
                }}
            >
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    id="resume-input"
                />
                <div className="upload-icon">📄</div>
                <p>
                    <strong>Click to browse</strong> or drag & drop your PDF here
                </p>
                {file && (
                    <div className="file-selected">
                        ✅ {file.name}
                    </div>
                )}
            </div>

            {error && (
                <div className="error-banner">
                    ⚠️ {error}
                </div>
            )}

            <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!file || loading}
            >
                {loading ? (
                    <><span className="loader dark" /> Uploading &amp; Parsing...</>
                ) : (
                    '⬆ Upload & Extract Skills'
                )}
            </button>

            {uploadData && (
                <div className="upload-success">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                            <p>Resume parsed successfully</p>
                            <strong style={{ fontSize: '0.95rem' }}>{uploadData.fileName}</strong>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.75rem', marginBottom: 2 }}>ATS SCORE</p>
                            <span className="ats-badge">{uploadData.atsScore}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-dim)' }}>/100</span></span>
                        </div>
                    </div>

                    <div>
                        <p style={{ marginBottom: 8 }}>Detected <strong>{uploadData.skills.length} skills</strong></p>
                        <div className="skills-grid">
                            {uploadData.skills.map(s => (
                                <span key={s} className="skill-pill neutral">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
