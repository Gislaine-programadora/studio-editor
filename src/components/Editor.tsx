import React, { useEffect, useRef } from "react";
import { FileTreeItem } from "../types";
import {Save} from 'lucide-react';

interface EditorProps {
  file: FileTreeItem | null;
  content: string;
  onContentChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ file, content, onContentChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [file]);

  const handleSave = () => {
    // Content is already saved to state, just show feedback
    const saveButton = document.getElementById("save-button");
    if (saveButton) {
      saveButton.textContent = "Saved!";
      setTimeout(() => {
        saveButton.textContent = "Save";
      }, 1500);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const getHighlightedContent = () => {
    if (!file || !content) return [];
    
    const lines = content.split("\n");
    const extension = getFileExtension(file.name);
    
    return lines.map((line, index) => {
      let coloredLine = line;
      
      if (["html", "htm"].includes(extension)) {
        // HTML Tags (opening and closing)
        coloredLine = coloredLine.replace(/(<\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '<span class="text-[#569CD6]">$1$2</span>');
        // Closing bracket
        coloredLine = coloredLine.replace(/(>)/g, '<span class="text-[#569CD6]">$1</span>');
        // Attributes
        coloredLine = coloredLine.replace(/\s([a-zA-Z-]+)=/g, ' <span class="text-[#9CDCFE]">$1</span>=');
        // Attribute values (strings)
        coloredLine = coloredLine.replace(/="([^"]*)"/g, '=<span class="text-[#CE9178]">"$1"</span>');
        // Script/Style content between tags
        coloredLine = coloredLine.replace(/\b(function|const|let|var|return|if|else|for|while|document|console|log)\b/g, '<span class="text-[#DCDCAA]">$1</span>');
        // Strings in JS
        coloredLine = coloredLine.replace(/(['"`])([^'"\`]*?)\1/g, '<span class="text-[#CE9178]">$1$2$1</span>');
        // Comments
        coloredLine = coloredLine.replace(/(\/\*.*?\*\/|\/\/.*$|<!--.*?-->)/g, '<span class="text-[#6A9955]">$1</span>');
      } else if (["js", "jsx", "ts", "tsx"].includes(extension)) {
        // Keywords
        coloredLine = coloredLine.replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|new|this|try|catch|throw)\b/g, '<span class="text-[#569CD6]">$1</span>');
        // Function names
        coloredLine = coloredLine.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-[#DCDCAA]">$1</span>(');
        // Strings
        coloredLine = coloredLine.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span class="text-[#CE9178]">$1</span>');
        // Comments
        coloredLine = coloredLine.replace(/(\/\/.*$|\/\*.*?\*\/)/g, '<span class="text-[#6A9955]">$1</span>');
        // Numbers
        coloredLine = coloredLine.replace(/\b(\d+)\b/g, '<span class="text-[#B5CEA8]">$1</span>');
      } else if (["css", "scss"].includes(extension)) {
        // Properties
        coloredLine = coloredLine.replace(/([a-z-]+)(?=:)/g, '<span class="text-[#9CDCFE]">$1</span>');
        // Values
        coloredLine = coloredLine.replace(/:\s*([^;]+)/g, ': <span class="text-[#CE9178]">$1</span>');
        // Selectors
        coloredLine = coloredLine.replace(/([.#][\w-]+)/g, '<span class="text-[#D7BA7D]">$1</span>');
      } else if (extension === "json") {
        // Keys
        coloredLine = coloredLine.replace(/"([\w-]+)":/g, '<span class="text-[#9CDCFE]">"$1"</span>:');
        // String values
        coloredLine = coloredLine.replace(/:\s*"([^"]+)"/g, ': <span class="text-[#CE9178]">"$1"</span>');
        // Numbers
        coloredLine = coloredLine.replace(/:\s*(\d+)/g, ': <span class="text-[#B5CEA8]">$1</span>');
      }
      
      return { lineNumber: index + 1, content: coloredLine };
    });
  };

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1E1E1E] text-[#858585]">
        <div className="text-center">
          <FileText size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No file selected</p>
          <p className="text-sm mt-2">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  const extension = getFileExtension(file.name);

  return (
    <div className="flex-1 flex flex-col bg-[#1E1E1E]">
      {/* Tab Bar */}
      <div className="h-9 bg-[#252526] border-b border-[#2D2D30] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">{file.name}</span>
        </div>
        <button
          id="save-button"
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-1 text-xs bg-[#007ACC] hover:bg-[#0098FF] rounded transition-colors"
        >
          <Save size={12} />
          Save
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-auto flex">
        {/* Line Numbers */}
        <div className="bg-[#1E1E1E] text-[#858585] text-right pr-3 pl-4 pt-4 font-mono text-sm select-none" style={{ lineHeight: "1.6" }}>
          {getHighlightedContent().map((line) => (
            <div key={line.lineNumber}>{line.lineNumber}</div>
          ))}
        </div>
        
        {/* Syntax Highlighted Display */}
        <div className="flex-1 relative">
          <div 
            className="absolute inset-0 p-4 pl-3 font-mono text-sm pointer-events-none overflow-auto"
            style={{ lineHeight: "1.6", whiteSpace: "pre", color: "transparent" }}
          >
            {getHighlightedContent().map((line, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: line.content || "&nbsp;" }} />
            ))}
          </div>
          
          {/* Actual Textarea (invisible but interactive) */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white p-4 pl-3 font-mono text-sm resize-none focus:outline-none"
            style={{
              lineHeight: "1.6",
              tabSize: 2,
              caretColor: "#FFFFFF"
            }}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007ACC] flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4">
          <span>Line 1, Col 1</span>
          <span>UTF-8</span>
          <span className="uppercase">{extension || "plaintext"}</span>
        </div>
      </div>
    </div>
  );
};

const FileText = ({ size, className }: { size: number; className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default Editor;
