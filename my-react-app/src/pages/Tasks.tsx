import { useState, useEffect, type JSX } from 'react';
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

const BugIcon = () => (
    <svg className="task-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
    </svg>
);

const PaletteIcon = () => (
    <svg className="task-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
);

const DocIcon = () => (
    <svg className="task-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
);

const ScienceIcon = () => (
    <svg className="task-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 11.33L18 18H6l5-6.67V6h2m2.96-2H8.04C7.62 4 7.39 4.48 7.65 4.81L9 6.5v4.17L3.2 18.4c-.49.66-.02 1.6.8 1.6h16c.82 0 1.29-.94.8-1.6L15 10.67V6.5l1.35-1.69c.26-.33.03-.81-.39-.81z" />
    </svg>
);

const CodeIcon = () => (
    <svg className="task-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
);

const SpeedIcon = () => (
    <svg className="task-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z" />
    </svg>
);

interface Task {
    id: number;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    labels: string[];
    icon: JSX.Element;
    iconColor: string;
    daysAgo: number;
    category: string;
}

const getIconForCategory = (category: string) => {
    if (category.toLowerCase().includes('bug')) return <BugIcon />;
    if (category.toLowerCase().includes('doc')) return <DocIcon />;
    if (category.toLowerCase().includes('test')) return <ScienceIcon />;
    if (category.toLowerCase().includes('performance')) return <SpeedIcon />;
    if (category.toLowerCase().includes('feature')) return <PaletteIcon />;
    return <CodeIcon />;
};

const getIconColor = (difficulty: string) => {
    switch (difficulty) {
        case 'Easy': return 'text-green-400';
        case 'Medium': return 'text-yellow-400';
        case 'Hard': return 'text-red-400';
        default: return 'text-blue-400';
    }
};

export default function Tasks() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'difficulty'>('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/tasks');
                if (!response.ok) throw new Error('Failed to fetch tasks');
                const data = await response.json();

                const tasksWithIcons = data.tasks.map((task: any) => ({
                    ...task,
                    icon: getIconForCategory(task.category),
                    iconColor: getIconColor(task.difficulty)
                }));

                setAllTasks(tasksWithIcons);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load tasks');
                console.error('Error fetching tasks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const filteredTasks = allTasks
        .filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesDifficulty = selectedDifficulty === 'All' || task.difficulty === selectedDifficulty;
            return matchesSearch && matchesDifficulty;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return a.daysAgo - b.daysAgo;
            if (sortBy === 'oldest') return b.daysAgo - a.daysAgo;
            if (sortBy === 'difficulty') {
                const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            }
            return 0;
        });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'difficulty-easy';
            case 'Medium': return 'difficulty-medium';
            case 'Hard': return 'difficulty-hard';
            default: return '';
        }
    };

    const taskStats = {
        total: allTasks.length,
        easy: allTasks.filter(t => t.difficulty === 'Easy').length,
        medium: allTasks.filter(t => t.difficulty === 'Medium').length,
        hard: allTasks.filter(t => t.difficulty === 'Hard').length
    };

    return (
        <div className="tasks-page">
            <div className="tasks-container">
                {/* Stats Bar */}
                <div className="stats-bar">
                    <div className="stat-item">
                        <span className="stat-value">{taskStats.total}</span>
                        <span className="stat-label">Total Tasks</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value stat-easy">{taskStats.easy}</span>
                        <span className="stat-label">Easy</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value stat-medium">{taskStats.medium}</span>
                        <span className="stat-label">Medium</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value stat-hard">{taskStats.hard}</span>
                        <span className="stat-label">Hard</span>
                    </div>
                </div>

                <div className="tasks-header">
                    <div className="header-content">
                        <h1 className="tasks-title">Available Tasks</h1>
                        <p className="tasks-subtitle">
                            Showing {filteredTasks.length} of {allTasks.length} tasks
                        </p>
                    </div>

                    <div className="search-filter-row">
                        <div className="search-wrapper">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search tasks, labels, or descriptions..."
                                className="search-input-tasks"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="clear-search"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <button
                            className={`filter-button ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FilterIcon />
                            <span className="filter-text">Filters</span>
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="filter-panel">
                            <div className="filter-group">
                                <label className="filter-label">Difficulty</label>
                                <div className="filter-options">
                                    {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                                        <button
                                            key={diff}
                                            className={`filter-chip ${selectedDifficulty === diff ? 'active' : ''}`}
                                            onClick={() => setSelectedDifficulty(diff)}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="filter-group">
                                <label className="filter-label">Sort By</label>
                                <div className="filter-options">
                                    <button
                                        className={`filter-chip ${sortBy === 'newest' ? 'active' : ''}`}
                                        onClick={() => setSortBy('newest')}
                                    >
                                        Newest
                                    </button>
                                    <button
                                        className={`filter-chip ${sortBy === 'oldest' ? 'active' : ''}`}
                                        onClick={() => setSortBy('oldest')}
                                    >
                                        Oldest
                                    </button>
                                    <button
                                        className={`filter-chip ${sortBy === 'difficulty' ? 'active' : ''}`}
                                        onClick={() => setSortBy('difficulty')}
                                    >
                                        Difficulty
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tasks Grid */}
                {loading ? (
                    <div className="no-results">
                        <div className="no-results-icon">⏳</div>
                        <h3 className="no-results-title">Loading tasks...</h3>
                    </div>
                ) : error ? (
                    <div className="no-results">
                        <div className="no-results-icon">❌</div>
                        <h3 className="no-results-title">Error loading tasks</h3>
                        <p className="no-results-text">{error}</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3 className="no-results-title">No tasks found</h3>
                        <p className="no-results-text">
                            Try adjusting your search or filters
                        </p>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {filteredTasks.map((task, index) => (
                            <Link
                                key={task.id}
                                to={`/tasks/${task.id}`}
                                className="task-card"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="task-card-header">
                                    <div className={`task-card-icon ${task.iconColor}`}>
                                        {task.icon}
                                    </div>
                                    <span className="task-category">{task.category}</span>
                                </div>
                                <div className="task-card-content">
                                    <h3 className="task-card-title">{task.title}</h3>
                                    <p className="task-card-description">{task.description}</p>
                                </div>
                                <div className="task-card-labels">
                                    <span className={`difficulty-badge ${getDifficultyColor(task.difficulty)}`}>
                                        {task.difficulty}
                                    </span>
                                    {task.labels.slice(0, 3).map((label, idx) => (
                                        <span key={idx} className="label-badge">
                                            {label}
                                        </span>
                                    ))}
                                    {task.labels.length > 3 && (
                                        <span className="label-badge label-more">
                                            +{task.labels.length - 3}
                                        </span>
                                    )}
                                </div>
                                <div className="task-card-footer">
                                    <span className="task-card-meta">
                                        #{task.id} • {task.daysAgo} {task.daysAgo === 1 ? 'day' : 'days'} ago
                                    </span>
                                    <button className="start-task-btn" onClick={(e) => e.preventDefault()}>
                                        Start Task
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}