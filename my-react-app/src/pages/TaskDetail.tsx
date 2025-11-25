import './TaskDetail.css';

export default function TaskDetail() {
    return (
        <div className="task-detail-page">
            <div className="task-detail-container">
                <div className="task-header-detail">
                    <div className="task-meta">
                        <h1 className="task-detail-title">#1234. Fix typo in documentation</h1>
                        <div className="task-badges">
                            <span className="difficulty-badge-detail beginner">Beginner</span>
                            <span className="label-badge-detail">documentation</span>
                            <span className="label-badge-detail">good first issue</span>
                        </div>
                    </div>
                </div>

                <div className="task-content">
                    <div className="task-description">
                        <h2 className="section-title">Description</h2>
                        <p className="description-text">
                            There is a typo in the documentation that needs to be fixed. The word "recieve" should be "receive"
                            in the installation guide.
                        </p>

                        <h3 className="subsection-title">Steps to Reproduce</h3>
                        <ol className="task-list">
                            <li>Navigate to the documentation page</li>
                            <li>Go to the installation section</li>
                            <li>Find the typo in line 42</li>
                        </ol>

                        <h3 className="subsection-title">Expected Behavior</h3>
                        <p className="description-text">
                            The documentation should have correct spelling throughout.
                        </p>
                    </div>

                    <div className="task-sidebar">
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Details</h3>
                            <div className="detail-item">
                                <span className="detail-label">Status:</span>
                                <span className="detail-value">Open</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Created:</span>
                                <span className="detail-value">2 days ago</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Repository:</span>
                                <span className="detail-value">example/repo</span>
                            </div>
                        </div>

                        <button className="claim-button">Claim This Task</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
