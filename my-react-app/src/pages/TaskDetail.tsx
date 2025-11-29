import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './TaskDetail.css';

const BackIcon = () => (
    <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

export default function TaskDetail() {
    const { id } = useParams();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/v1/tasks/${id}`);
                if (!response.ok) throw new Error('Task not found');
                const data = await response.json();
                setTask(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load task');
                console.error('Error fetching task:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTask();
    }, [id]);

    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'beginner';
            case 'Medium': return 'intermediate';
            case 'Hard': return 'advanced';
            default: return 'beginner';
        }
    };

    if (loading) {
        return (
            <div className="task-detail-page">
                <div className="task-detail-container">
                    <Link to="/tasks" className="back-button">
                        <BackIcon />
                        Back to Tasks
                    </Link>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Loading task details...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="task-detail-page">
                <div className="task-detail-container">
                    <Link to="/tasks" className="back-button">
                        <BackIcon />
                        Back to Tasks
                    </Link>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Error: {error || 'Task not found'}</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="task-detail-page">
            <div className="task-detail-container">
                <Link to="/tasks" className="back-button">
                    <BackIcon />
                    Back to Tasks
                </Link>

                <div className="task-header-detail">
                    <h1 className="task-detail-title">#{task.id}. {task.title}</h1>
                    <div className="task-badges">
                        <span className={`difficulty-badge-detail ${getDifficultyClass(task.difficulty)}`}>
                            {task.difficulty}
                        </span>
                        {task.labels && task.labels.map((label: string, idx: number) => (
                            <span key={idx} className="label-badge-detail">{label}</span>
                        ))}
                    </div>
                </div>

                <div className="task-content">
                    <div className="task-description">
                        <h2 className="section-title">Description</h2>
                        <p className="description-text">
                            {task.description || 'No description available.'}
                        </p>

                        {task.code_files && task.code_files.length > 0 && (
                            <>
                                <h3 className="subsection-title">Code Files</h3>
                                <ul className="task-list">
                                    {task.code_files.map((file: any, idx: number) => (
                                        <li key={idx}>
                                            <strong>{file.path}</strong> ({file.language || 'Unknown'})
                                            {file.before_missing && <span> - New file</span>}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {task.html_url && (
                            <>
                                <h3 className="subsection-title">Original Issue</h3>
                                <p className="description-text">
                                    <a href={task.html_url} target="_blank" rel="noopener noreferrer"
                                        style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                                        View on GitHub →
                                    </a>
                                </p>
                            </>
                        )}
                    </div>

                    <div className="task-sidebar">
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Task Details</h3>
                            <div className="detail-item">
                                <span className="detail-label">Status</span>
                                <span className="status-badge">{task.status || 'Open'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Created</span>
                                <span className="detail-value">
                                    {task.daysAgo} {task.daysAgo === 1 ? 'day' : 'days'} ago
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Repository</span>
                                <span className="detail-value">{task.owner}/{task.repo}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Category</span>
                                <span className="detail-value">{task.category}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Code Files</span>
                                <span className="detail-value">
                                    {task.code_files ? task.code_files.length : 0}
                                </span>
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Reward</h3>
                            <div className="reward-section">
                                <div className="reward-amount">100 Points</div>
                                <div className="reward-label">Upon Completion</div>
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
