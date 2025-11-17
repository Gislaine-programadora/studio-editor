import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  fileName: string | null;
  content: string;
  onContentChange: (content: string) => void;
}

export default function CodeEditor({
  fileName,
  content,
  onContentChange,
}: CodeEditorProps) {
  const [value, setValue] = useState(content);

  useEffect(() => {
    setValue(content);
  }, [content]);

  return (
    <div className="h-full w-full bg-gray-900">
      {fileName ? (
        <div className="text-sm text-gray-400 p-2 border-b border-gray-700">
          Editando: {fileName}
        </div>
      ) : (
        <div className="text-sm text-gray-400 p-2 border-b border-gray-700">
          Nenhum arquivo aberto
        </div>
      )}
      <Editor
        height="calc(100% - 40px)"
        language={fileName?.endsWith(".tsx") ? "typescript" : "plaintext"}
        value={value}
        theme="vs-dark"
        onChange={(val) => {
          setValue(val || "");
          onContentChange(val || "");
        }}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          smoothScrolling: true,
          cursorBlinking: "phase",
          formatOnType: true,
          formatOnPaste: true,
          scrollbar: { vertical: "auto", horizontal: "auto" },
        }}
      />
    </div>
  );
}
