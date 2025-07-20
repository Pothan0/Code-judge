import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language, height = '400px' }) => {
  const getMonacoLanguage = (lang) => {
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      default: return 'cpp';
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: 'on',
    tabSize: 4,
    insertSpaces: true,
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={onChange}
        options={editorOptions}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
