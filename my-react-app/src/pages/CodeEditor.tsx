import React, { useState } from 'react';
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

export default function CodeEditor() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'submissions'>('description');
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(`function fixNavbarAlignment() {
  // Write your solution here
  const navbar = document.querySelector('.navbar');
  
  // TODO: Fix alignment for mobile devices
  // Hint: Use flexbox properties and media queries
  
  return navbar;
}

// Test your solution
fixNavbarAlignment();`);
    const [testResults, setTestResults] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);

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
        setCode(`function fixNavbarAlignment() {
  // Write your solution here
  const navbar = document.querySelector('.navbar');
  
  // TODO: Fix alignment for mobile devices
  // Hint: Use flexbox properties and media queries
  
  return navbar;
}

// Test your solution
fixNavbarAlignment();`);
    };

    return (
        <div className="code-editor-page">
            <div className="editor-header">
                <Link to={`/tasks/${id}`} className="back-link">
                    <BackIcon />
                    Back to Task
                </Link>
                <div className="editor-title">
                    <span className="task-id">#{id}</span>
                    <span className="task-name">Fix alignment issue on mobile navigation bar</span>
                </div>
                <div className="editor-actions">
                    <span className="difficulty-badge-editor easy">Easy</span>
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
                                <p className="content-text">
                                    The navigation bar has alignment issues on mobile devices (viewport width &lt; 768px).
                                    The logo and menu items overlap and don't display correctly.
                                </p>

                                <h3 className="content-subtitle">Requirements</h3>
                                <ul className="content-list">
                                    <li>Fix flexbox alignment for mobile screens</li>
                                    <li>Ensure proper spacing between elements</li>
                                    <li>Logo should be appropriately sized</li>
                                    <li>Menu items should not overlap</li>
                                </ul>

                                <h3 className="content-subtitle">Constraints</h3>
                                <ul className="content-list">
                                    <li>Must work on screens from 320px to 768px</li>
                                    <li>Use CSS media queries</li>
                                    <li>Maintain existing functionality</li>
                                </ul>

                                <h3 className="content-subtitle">Example</h3>
                                <div className="code-example">
                                    <div className="code-example-header">Input</div>
                                    <pre className="code-example-content">
                                        {`Viewport: 375px width
Elements: [logo, menu-item-1, menu-item-2, menu-item-3]`}
                                    </pre>
                                </div>
                                <div className="code-example">
                                    <div className="code-example-header">Expected Output</div>
                                    <pre className="code-example-content">
                                        {`All elements properly aligned
No overlapping
Proper spacing maintained`}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {activeTab === 'solution' && (
                            <div className="solution-content">
                                <h2 className="content-title">Solution Approach</h2>
                                <p className="content-text">
                                    This problem can be solved using CSS flexbox with proper media queries.
                                </p>
                                <div className="hint-box">
                                    <strong>Hint:</strong> Consider using flex-direction: column for mobile layouts
                                </div>
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
                    <div className="code-editor-header">
                        <select
                            className="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="css">CSS</option>
                            <option value="html">HTML</option>
                        </select>
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
