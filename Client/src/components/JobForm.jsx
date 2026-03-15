export default function JobForm({ resumeId, onAnalyze, loading }) {
    return (
        <div className="card">
            <div className="card-title">
                <span className="step-badge">STEP 2</span>
                Paste the Job Description
            </div>

            <textarea
                id="job-description"
                placeholder="Paste the full job description here... e.g. &#10;&#10;We are looking for a backend engineer with Node.js, Docker, and AWS experience..."
                onChange={(e) => onAnalyze.setJobDescription(e.target.value)}
            />

            {!resumeId && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: 10, textAlign: 'center' }}>
                    ⬆ Upload a resume first to enable analysis
                </p>
            )}

            <button
                className="btn btn-analyze"
                onClick={onAnalyze.run}
                disabled={!resumeId || loading}
            >
                {loading ? (
                    <><span className="loader" /> Analyzing with AI...</>
                ) : (
                    '🔍 Analyze with AI'
                )}
            </button>
        </div>
    );
}
