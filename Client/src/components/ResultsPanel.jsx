/**
 * Parses the raw AI insights string from Gemini into structured sections.
 * Handles the **Strengths**, **Weaknesses / Skill Gaps**, and **Recommendations** headers.
 */
function parseInsights(raw) {
    if (!raw) return null;

    const sections = [
        { key: 'strengths',       label: 'Strengths',               icon: '✅', cls: 'strengths',      markers: ['**Strengths**', '**Strengths**:'] },
        { key: 'weaknesses',      label: 'Weaknesses / Skill Gaps', icon: '⚠️', cls: 'weaknesses',     markers: ['**Weaknesses / Skill Gaps**', '**Weaknesses**', '**Skill Gaps**'] },
        { key: 'recommendations', label: 'Recommendations',         icon: '💡', cls: 'recommendations', markers: ['**Recommendations**'] }
    ];

    // Build an ordered list of found markers and their positions
    const found = [];
    for (const section of sections) {
        for (const marker of section.markers) {
            const idx = raw.indexOf(marker);
            if (idx !== -1) {
                found.push({ ...section, idx, markerLen: marker.length });
                break;
            }
        }
    }

    if (found.length === 0) {
        // No parseable structure — return the whole thing as a single block
        return [{ key: 'insights', label: 'AI Analysis', icon: '🤖', cls: 'recommendations', text: raw.trim() }];
    }

    // Sort by position
    found.sort((a, b) => a.idx - b.idx);

    // Slice content between markers
    return found.map((section, i) => {
        const start = section.idx + section.markerLen;
        const end = found[i + 1] ? found[i + 1].idx : raw.length;
        const text = raw.slice(start, end).replace(/^\n+/, '').trim();
        return { ...section, text };
    });
}

function getMatchClass(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'mid';
    return 'low';
}

export default function ResultsPanel({ data }) {
    if (!data) {
        return (
            <div className="card">
                <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <h3>Ready to Analyze</h3>
                    <p>Upload a resume and paste a job description to view your match score and AI-powered career insights.</p>
                </div>
            </div>
        );
    }

    const { atsScore, matchScore, matchedSkills, missingSkills, insights } = data;
    const matchClass = getMatchClass(matchScore);
    const parsedInsights = parseInsights(insights);

    return (
        <div className="card" id="results-panel">
            <div className="card-title" style={{ marginBottom: 24 }}>
                📊 Analysis Results
            </div>

            {/* ─── Scores ─── */}
            <div className="scores-row">
                <div className="score-card">
                    <div className="score-label">ATS Score</div>
                    <div className="score-value ats">
                        {atsScore}<span className="score-suffix">/100</span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <div className="progress-bar-wrap">
                            <div className="progress-bar-fill high" style={{ width: `${atsScore}%` }} />
                        </div>
                    </div>
                </div>

                <div className="score-card">
                    <div className="score-label">Job Match</div>
                    <div className={`score-value match-${matchClass}`}>
                        {matchScore}<span className="score-suffix">%</span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <div className="progress-bar-wrap">
                            <div className={`progress-bar-fill ${matchClass}`} style={{ width: `${matchScore}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Matched Skills ─── */}
            {matchedSkills?.length > 0 && (
                <div className="skills-section">
                    <h4>✅ Matched Skills ({matchedSkills.length})</h4>
                    <div className="skills-grid">
                        {matchedSkills.map(s => (
                            <span key={s} className="skill-pill matched">{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── Missing Skills ─── */}
            {missingSkills?.length > 0 && (
                <div className="skills-section">
                    <h4>❌ Missing Skills ({missingSkills.length})</h4>
                    <div className="skills-grid">
                        {missingSkills.map(s => (
                            <span key={s} className="skill-pill missing">{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {missingSkills?.length === 0 && matchedSkills?.length > 0 && (
                <p style={{ fontSize: '0.88rem', color: 'var(--green)', marginBottom: 20 }}>
                    🎉 You match all required skills for this role!
                </p>
            )}

            {/* ─── AI Insights ─── */}
            {parsedInsights && (
                <div>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-dim)', marginBottom: 12 }}>
                        🤖 AI Insights
                    </h4>
                    <div className="insights-block">
                        {parsedInsights.map(section => (
                            <div key={section.key} className="insight-section">
                                <div className={`insight-header ${section.cls}`}>
                                    {section.icon} {section.label}
                                </div>
                                <p>{section.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
