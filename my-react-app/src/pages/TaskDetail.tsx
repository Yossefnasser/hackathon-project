import { Link, useParams } from 'react-router-dom';
import './TaskDetail.css';

const BackIcon = () => (
    <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

export default function TaskDetail() {
    const { id } = useParams();

    return (
        <div className="task-detail-page">
            <div className="task-detail-container">
                <Link to="/tasks" className="back-button">
                    <BackIcon />
                    Back to Tasks
                </Link>

                <div className="task-header-detail">
                    <h1 className="task-detail-title">#{id}. Fix alignment issue on mobile navigation bar</h1>
                    <div className="task-badges">
                        <span className="difficulty-badge-detail beginner">Easy</span>
                        <span className="label-badge-detail">JavaScript</span>
                        <span className="label-badge-detail">UI</span>
                        <span className="label-badge-detail">Mobile</span>
                    </div>
                </div>

                <div className="task-content">
                    <div className="task-description">
                        <h2 className="section-title">Description</h2>
                        <p className="description-text">
                            The main logo and menu items in the navigation bar are currently misaligned on screen
                            widths below 768px. This creates a poor user experience on mobile devices and needs to
                            be fixed to ensure proper responsive design.
                        </p>

                        <h3 className="subsection-title">Current Behavior</h3>
                        <p className="description-text">
                            On mobile devices (viewport width &lt; 768px), the navigation elements overlap and don't
                            align properly. The logo appears too large and pushes menu items out of view.
                        </p>

                        <h3 className="subsection-title">Expected Behavior</h3>
                        <p className="description-text">
                            The navigation bar should:
                        </p>
                        <ul className="task-list">
                            <li>Display the logo at an appropriate size for mobile screens</li>
                            <li>Show menu items in a hamburger menu or properly stacked layout</li>
                            <li>Maintain proper spacing and alignment across all breakpoints</li>
                            <li>Use flexbox or grid properties correctly for responsive behavior</li>
                        </ul>

                        <h3 className="subsection-title">Steps to Reproduce</h3>
                        <ol className="task-list">
                            <li>Open the application in a browser</li>
                            <li>Resize the viewport to 767px or less</li>
                            <li>Observe the navigation bar alignment issues</li>
                        </ol>

                        <h3 className="subsection-title">Suggested Solution</h3>
                        <p className="description-text">
                            Update the CSS media queries and flexbox properties in the navigation component.
                            Consider implementing a mobile-first approach with proper breakpoints.
                        </p>
                        <div className="code-block">
                            @media (max-width: 768px) {'{'}
                            <br />
                            &nbsp;&nbsp;.nav-container {'{'}
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;flex-direction: column;
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;align-items: center;
                            <br />
                            &nbsp;&nbsp;{'}'}
                            <br />
                            {'}'}
                        </div>

                        <h3 className="subsection-title">Acceptance Criteria</h3>
                        <ul className="task-list">
                            <li>Navigation displays correctly on all screen sizes (320px - 1920px)</li>
                            <li>No overlapping elements on mobile devices</li>
                            <li>Proper spacing and alignment maintained</li>
                            <li>Passes responsive design testing</li>
                        </ul>
                    </div>

                    <div className="task-sidebar">
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Task Details</h3>
                            <div className="detail-item">
                                <span className="detail-label">Status</span>
                                <span className="status-badge">Open</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Created</span>
                                <span className="detail-value">3 days ago</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Repository</span>
                                <span className="detail-value">example/repo</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Category</span>
                                <span className="detail-value">Bug Fix</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Estimated Time</span>
                                <span className="detail-value">2-3 hours</span>
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Reward</h3>
                            <div className="reward-section">
                                <div className="reward-amount">100 Points</div>
                                <div className="reward-label">Upon Completion</div>
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Contributors</h3>
                            <p className="description-text" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                3 developers are watching this task
                            </p>
                            <div className="contributors-list">
                                <div className="contributor-avatar" title="User 1">A</div>
                                <div className="contributor-avatar" title="User 2">B</div>
                                <div className="contributor-avatar" title="User 3">C</div>
                            </div>
                        </div>

                        <Link to={`/tasks/${id}/solve`} className="claim-button">
                            Claim This Task
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
