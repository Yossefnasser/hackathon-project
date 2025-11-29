import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const BackIcon = () => (
    <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const PlayIcon = () => (
    <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
    </svg>
);

const FileIcon = () => (
    <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
    </svg>
);

interface Task {
    id: number;
    title: string;
    description: string;
    detailedDescription: string;
    difficulty: string;
    category: string;
    timeEstimate: string;
    hints: string[];
    technologies: string[];
    code_files: CodeFile[];
}

interface CodeFile {
    path: string;
    content: string;
    language: string;
    before_missing: boolean;
    patch: string;
}

export default function CodeEditor() {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'submissions'>('description');
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [testResults, setTestResults] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/v1/tasks/${id}`);
                if (!response.ok) throw new Error('Failed to fetch task');
                const data = await response.json();
                setTask(data);

                // Set initial code from first file
                if (data.code_files && data.code_files.length > 0) {
                    setCode(data.code_files[0].content);
                    setLanguage(mapLanguageToMonaco(data.code_files[0].language));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load task');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTask();
    }, [id]);

    const mapLanguageToMonaco = (lang: string): string => {
        const langMap: { [key: string]: string } = {
            'Python': 'python',
            'JavaScript': 'javascript',
            'TypeScript': 'typescript',
            'Java': 'java',
            'C++': 'cpp',
            'C': 'c',
            'C#': 'csharp',
            'Ruby': 'ruby',
            'Go': 'go',
            'Rust': 'rust',
            'PHP': 'php',
            'HTML': 'html',
            'CSS': 'css',
            'JSON': 'json',
            'YAML': 'yaml',
            'Markdown': 'markdown',
            'SQL': 'sql',
            'Shell': 'shell'
        };
        return langMap[lang] || 'javascript';
    };

    const handleFileChange = (index: number) => {
        if (task && task.code_files[index]) {
            setActiveFileIndex(index);
            setCode(task.code_files[index].content);
            setLanguage(mapLanguageToMonaco(task.code_files[index].language));
        }
    };

    const handleRunCode = () => {
        setIsRunning(true);
        setTimeout(() => {
            setTestResults({
                passed: 2,
                total: 3,
                cases: [
                    { id: 1, name: 'Desktop view (1920px)', passed: true, time: '12ms' },
                    { id: 2, name: 'Tablet view (768px)', passed: true, time: '8ms' },
                    { id: 3, name: 'Mobile view (375px)', passed: false, time: '15ms', error: 'Elements still overlapping' }
                ]
            });
            setIsRunning(false);
        }, 1500);
    };

    const handleSubmit = () => {
        alert('Solution submitted! You earned 100 points.');
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    const resetCode = () => {
        if (task && task.code_files[activeFileIndex]) {
            setCode(task.code_files[activeFileIndex].content);
        }
    };

    if (loading) {
        return (
            <div className="code-editor-page">
                <div className="loading-state">Loading task...</div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="code-editor-page">
                <div className="error-state">
                    <h2>Error</h2>
                    <p>{error || 'Task not found'}</p>
                    <Link to="/tasks" className="back-link">← Back to Tasks</Link>
                </div>
            </div>
        );
    }

    const activeFile = task.code_files[activeFileIndex];
    const getFileName = (path: string) => {
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    return (
        <div className="code-editor-page">
            <div className="editor-header">
                <Link to={`/tasks/${id}`} className="back-link">
                    <BackIcon />
                    Back to Task
                </Link>
                <div className="editor-title">
                    <span className="task-id">#{task.id}</span>
                    <span className="task-name">{task.title}</span>
                </div>
                <div className="editor-actions">
                    <span className={`difficulty-badge-editor ${task.difficulty.toLowerCase()}`}>
                        {task.difficulty}
                    </span>
                </div>
            </div>

            <div className="editor-container">
                {/* Left Panel - Description */}
                <div className="left-panel">
                    <div className="panel-tabs">
                        <button
                            className={`panel-tab ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`panel-tab ${activeTab === 'solution' ? 'active' : ''}`}
                            onClick={() => setActiveTab('solution')}
                        >
                            Solution
                        </button>
                        <button
                            className={`panel-tab ${activeTab === 'submissions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('submissions')}
                        >
                            Submissions
                        </button>
                    </div>

                    <div className="panel-content">
                        {activeTab === 'description' && (
                            <div className="description-content">
                                <h2 className="content-title">Problem Description</h2>
                                <p className="content-text">{task.description}</p>

                                {task.detailedDescription && (
                                    <>
                                        <h3 className="content-subtitle">Detailed Explanation</h3>
                                        <p className="content-text">{task.detailedDescription}</p>
                                    </>
                                )}

                                {task.technologies.length > 0 && (
                                    <>
                                        <h3 className="content-subtitle">Technologies</h3>
                                        <div className="tech-tags">
                                            {task.technologies.map((tech, idx) => (
                                                <span key={idx} className="tech-tag">{tech}</span>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <h3 className="content-subtitle">Time Estimate</h3>
                                <p className="content-text">{task.timeEstimate}</p>

                                {activeFile && (
                                    <>
                                        <h3 className="content-subtitle">Current File</h3>
                                        <div className="file-info">
                                            <FileIcon />
                                            <span>{activeFile.path}</span>
                                        </div>
                                        {activeFile.before_missing && (
                                            <div className="warning-box">
                                                ⚠️ Before-fix version not available. Showing current state.
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'solution' && (
                            <div className="solution-content">
                                <h2 className="content-title">Hints</h2>
                                {task.hints.length > 0 ? (
                                    <div className="hints-list">
                                        {task.hints.map((hint, idx) => (
                                            <div key={idx} className="hint-box">
                                                <strong>Hint {idx + 1}:</strong> {hint}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="content-text">No hints available for this task.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'submissions' && (
                            <div className="submissions-content">
                                <h2 className="content-title">Your Submissions</h2>
                                <p className="content-text">No submissions yet. Submit your solution to see it here!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Monaco Editor */}
                <div className="right-panel">
                    {/* File Tabs - Only show if multiple files */}
                    {task.code_files.length > 1 && (
                        <div className="file-tabs">
                            {task.code_files.map((file, index) => (
                                <button
                                    key={index}
                                    className={`file-tab ${activeFileIndex === index ? 'active' : ''}`}
                                    onClick={() => handleFileChange(index)}
                                    title={file.path}
                                >
                                    <FileIcon />
                                    <span className="file-name">{getFileName(file.path)}</span>
                                    <span className="file-lang">{file.language}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="code-editor-header">
                        <div className="file-path-display">
                            {activeFile && (
                                <>
                                    <FileIcon />
                                    <span className="current-file-path">{activeFile.path}</span>
                                </>
                            )}
                        </div>
                        <button className="reset-btn" onClick={resetCode}>Reset Code</button>
                    </div>

                    <div className="monaco-editor-wrapper">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={handleEditorChange}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                readOnly: false,
                                automaticLayout: true,
                                tabSize: 2,
                                wordWrap: 'on',
                                formatOnPaste: true,
                                formatOnType: true,
                                suggestOnTriggerCharacters: true,
                                quickSuggestions: true,
                                folding: true,
                                bracketPairColorization: {
                                    enabled: true
                                }
                            }}
                        />
                    </div>

                    {/* Test Results - Positioned above footer */}
                    {testResults && (
                        <div className="test-results">
                            <div className="results-header">
                                <h3 className="results-title">Test Results</h3>
                                <span className={`results-status ${testResults.passed === testResults.total ? 'passed' : 'failed'}`}>
                                    {testResults.passed}/{testResults.total} Passed
                                </span>
                            </div>
                            <div className="test-cases">
                                {testResults.cases.map((testCase: any) => (
                                    <div key={testCase.id} className={`test-case ${testCase.passed ? 'passed' : 'failed'}`}>
                                        <div className="test-case-header">
                                            <span className="test-case-icon">
                                                {testCase.passed ? '✓' : '✗'}
                                            </span>
                                            <span className="test-case-name">{testCase.name}</span>
                                            <span className="test-case-time">{testCase.time}</span>
                                        </div>
                                        {testCase.error && (
                                            <div className="test-case-error">{testCase.error}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="editor-footer">
                        <div className="footer-actions">
                            <button
                                className="run-btn"
                                onClick={handleRunCode}
                                disabled={isRunning}
                            >
                                <PlayIcon />
                                {isRunning ? 'Running...' : 'Run Code'}
                            </button>
                            <button
                                className="submit-btn"
                                onClick={handleSubmit}
                            >
                                <CheckIcon />
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
