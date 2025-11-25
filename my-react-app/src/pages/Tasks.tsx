import { Link } from 'react-router-dom';
import './Tasks.css';

const SearchIcon = () => (
    <svg className="search-icon-input" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const FilterIcon = () => (
    <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
);

export default function Tasks() {
    const tasks = [
        {
            id: 1234,
            title: 'Fix typo in documentation',
            difficulty: 'Beginner',
            labels: ['documentation', 'good first issue']
        },
        {
            id: 5678,
            title: 'Update dependencies to latest versions',
            difficulty: 'Beginner',
            labels: ['enhancement', 'javascript']
        },
        {
            id: 8321,
            title: 'Add dark mode toggle to user settings',
            difficulty: 'Beginner',
            labels: ['enhancement', 'UI']
        },
        {
            id: 9012,
            title: 'Improve error handling in API calls',
            difficulty: 'Intermediate',
            labels: ['bug', 'backend']
        },
        {
            id: 3456,
            title: 'Optimize database queries for performance',
            difficulty: 'Advanced',
            labels: ['performance', 'database']
        }
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner':
                return 'difficulty-beginner';
            case 'Intermediate':
                return 'difficulty-intermediate';
            case 'Advanced':
                return 'difficulty-advanced';
            default:
                return '';
        }
    };

    return (
        <div className="tasks-page">
            <div className="tasks-container">
                <div className="tasks-header">
                    <div className="header-content">
                        <h1 className="tasks-title">Available Tasks</h1>
                        <p className="tasks-subtitle">24 beginner-friendly issues</p>
                    </div>
                    <div className="search-filter-row">
                        <div className="search-wrapper">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search by keyword..."
                                className="search-input-tasks"
                            />
                        </div>
                        <button className="filter-button">
                            <FilterIcon />
                            <span className="filter-text">Filters</span>
                        </button>
                    </div>
                </div>

                <div className="tasks-table">
                    <div className="table-header">
                        <div className="header-cell title-header">Title</div>
                        <div className="header-cell difficulty-header">Difficulty</div>
                        <div className="header-cell labels-header">Labels</div>
                    </div>

                    <div className="table-body">
                        {tasks.map((task) => (
                            <Link key={task.id} to={`/tasks/${task.id}`} className="task-row">
                                <div className="task-title-cell">
                                    <span className="task-number">#{task.id}</span>
                                    <span className="task-title-text">{task.title}</span>
                                </div>
                                <div className="task-difficulty-cell">
                                    <span className={`difficulty-badge ${getDifficultyColor(task.difficulty)}`}>
                                        {task.difficulty}
                                    </span>
                                </div>
                                <div className="task-labels-cell">
                                    {task.labels.map((label, index) => (
                                        <span key={index} className="label-badge">
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
