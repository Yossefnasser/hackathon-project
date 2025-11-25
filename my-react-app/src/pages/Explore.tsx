import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Explore.css';

// Framework Icon Components
const DjangoIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 00-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v9.098c0 3.134-.229 4.638-.917 5.937-.637 1.249-1.478 2.039-3.211 2.905l-3.644-1.733c1.733-.815 2.574-1.53 3.109-2.625.56-1.121.738-2.421.738-5.835V6.059h3.925zM17.389.021h3.924v4.026h-3.924V.021z" />
    </svg>
);

const FastAPIIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.073 18.617l-4.927-2.844v-5.69l4.927 2.845v5.689zm1.073-.617V12.31l4.927-2.845v5.69L12 17.999zm6-7.383l-4.927-2.844L12 6.383l4.927 2.844L18 10.617zM12 5.383L7.073 8.227 12 11.07l4.927-2.843L12 5.383z" />
    </svg>
);

const ReactIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9.8 4.54c.3-.55.57-1.12.81-1.71-.69-.12-1.39-.21-2.09-.28-.19.33-.39.65-.59.96.23.11.98.68 1.87 1.03M6.08 7.46c-.3.55-.57 1.12-.81 1.71.69.12 1.39.21 2.09.28.19-.33.39-.65.59-.96-.23-.11-.98-.68-1.87-1.03m-3.45 9.54c-.63-.38-2.01.2-3.6 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.31-3.96z" />
    </svg>
);

const LaravelIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.039-.01-.012-.021-.023-.028-.037h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z" />
    </svg>
);

const VueIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M24 1.61h-4.68l-7.32 12.7L4.68 1.61H0L12 22.39zm-14.39 0l2.39 4.15 2.39-4.15h4.68L12 13.64 4.93 1.61z" />
    </svg>
);

const NodeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339c.082.045.197.045.272 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.085.05-.139.146-.139.24v10.15c0 .097.054.189.139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675c-.57-.329-.922-.943-.922-1.604V6.921c0-.661.353-1.275.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.329.924.943.924 1.603v10.15c0 .661-.354 1.276-.924 1.604l-8.794 5.078c-.28.163-.599.247-.925.247zm7.099-6.563c0-1.9-1.284-2.406-3.987-2.763-2.731-.361-3.009-.546-3.009-1.187 0-.526.235-1.228 2.258-1.228 1.807 0 2.473.389 2.747 1.607.024.105.115.184.221.184h1.141c.063 0 .124-.025.169-.07.046-.047.072-.111.065-.178-.16-1.898-1.488-2.783-4.343-2.783-2.484 0-3.968.049-3.968 2.461 0 1.927 1.493 2.457 3.896 2.695 2.871.283 3.099.708 3.099 1.272 0 .986-.789 1.402-2.642 1.402-2.327 0-2.839-.584-3.011-1.742-.019-.104-.11-.18-.215-.18h-1.14c-.114 0-.208.093-.208.207v.043c0 1.268.691 2.781 4.574 2.781 2.743 0 4.347-1.080 4.347-2.964z" />
    </svg>
);

const AngularIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M9.93 12.645h4.134L12 7.66M11.996 0l-12 4.2 1.83 15.8L12 24l10.17-3.99 1.83-15.81L11.996 0zm7.058 18.31h-2.636l-1.42-3.51H8.995l-1.42 3.51H4.937l7.06-15.62 7.057 15.62z" />
    </svg>
);

const SpringIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M21.8537 1.4158a10.4504 10.4504 0 0 1-1.284 2.2471A11.9666 11.9666 0 1 0 3.8518 20.7757l.4445.3951a11.9543 11.9543 0 0 0 19.6316-8.2971c.3457-2.0126.1997-4.0781-.4092-6.0174a.2346.2346 0 0 0-.3384-.1188 7.4792 7.4792 0 0 1-1.3266.6783zm-8.7119 18.5734c-4.4446 0-8.0538-3.6092-8.0538-8.0538 0-1.6289.4851-3.1443 1.3171-4.4204.1465-.2249.4411-.2877.6583-.1416 1.2686.8537 2.8779 1.3171 4.5773 1.3171 1.6289 0 3.1443-.4851 4.4204-1.3171.2249-.1465.5195-.0837.6583.1416.8537 1.2686 1.3171 2.8779 1.3171 4.4204 0 4.4446-3.6092 8.0538-8.0538 8.0538z" />
    </svg>
);

const FlaskIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="framework-icon">
        <path d="M7.5 3v9.75L2.25 21h19.5L16.5 12.75V3h-9zM9 4.5h6v7.875l4.125 6.375H4.875L9 12.375V4.5z" />
    </svg>
);

export default function Explore() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const allFrameworks = [
        { name: 'Django', issues: 78, category: 'Backend', icon: <DjangoIcon />, color: '#092e20' },
        { name: 'FastAPI', issues: 42, category: 'Backend', icon: <FastAPIIcon />, color: '#009688' },
        { name: 'Spring Boot', issues: 156, category: 'Backend', icon: <SpringIcon />, color: '#6db33f' },
        { name: 'Flask', issues: 89, category: 'Backend', icon: <FlaskIcon />, color: '#000000' },
        { name: 'React', issues: 124, category: 'Frontend', icon: <ReactIcon />, color: '#61dafb' },
        { name: 'Vue.js', issues: 110, category: 'Frontend', icon: <VueIcon />, color: '#42b883' },
        { name: 'Angular', issues: 98, category: 'Frontend', icon: <AngularIcon />, color: '#dd0031' },
        { name: 'Node.js', issues: 203, category: 'Runtime', icon: <NodeIcon />, color: '#339933' },
        { name: 'Laravel', issues: 95, category: 'Backend', icon: <LaravelIcon />, color: '#ff2d20' },
    ];

    const categories = ['All', 'Backend', 'Frontend', 'Runtime'];

    const filteredFrameworks = allFrameworks.filter(framework => {
        const matchesSearch = framework.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || framework.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const groupedFrameworks = filteredFrameworks.reduce((acc, framework) => {
        if (!acc[framework.category]) {
            acc[framework.category] = [];
        }
        acc[framework.category].push(framework);
        return acc;
    }, {} as Record<string, typeof allFrameworks>);

    const totalIssues = allFrameworks.reduce((sum, fw) => sum + fw.issues, 0);

    return (
        <div className="explore-page">
            <div className="explore-container">
                {/* Stats Bar */}
                <div className="explore-stats">
                    <div className="stat-card">
                        <div className="stat-value">{allFrameworks.length}</div>
                        <div className="stat-label">Technologies</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{totalIssues}</div>
                        <div className="stat-label">Open Tasks</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{categories.length - 1}</div>
                        <div className="stat-label">Categories</div>
                    </div>
                </div>

                <div className="explore-header">
                    <h1 className="explore-title">Find Your Next Challenge</h1>
                    <p className="explore-subtitle">
                        Discover tasks categorized by technology to find your next project.
                    </p>
                </div>

                <div className="search-filters">
                    <div className="search-bar">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for technologies..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="clear-search-explore"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <div className="filter-buttons">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredFrameworks.length === 0 ? (
                    <div className="no-results-explore">
                        <div className="no-results-icon-explore">🔍</div>
                        <h3 className="no-results-title-explore">No technologies found</h3>
                        <p className="no-results-text-explore">
                            Try adjusting your search or filters
                        </p>
                    </div>
                ) : (
                    <div className="frameworks-section">
                        {Object.entries(groupedFrameworks).map(([category, frameworks]) => (
                            <div key={category} className="framework-category">
                                <h2 className="category-title">{category}</h2>
                                <div className="framework-grid">
                                    {frameworks.map((framework, index) => (
                                        <Link
                                            key={framework.name}
                                            to="/tasks"
                                            className="framework-card"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <div className="framework-logo">{framework.icon}</div>
                                            <div className="framework-info">
                                                <h3 className="framework-name">{framework.name}</h3>
                                                <p className="framework-issues">{framework.issues} Open Tasks</p>
                                            </div>
                                            <div className="framework-arrow">→</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
