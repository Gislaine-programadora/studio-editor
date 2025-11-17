import React, { useState, useRef, useEffect } from "react";
import {Terminal as TerminalIcon, X, Maximize2, Minimize2} from 'lucide-react';
import { FileTreeItem } from "../types";

interface TerminalProps {
  onCreateFolder: (parentId: string | null, name: string, type: "file" | "folder") => void;
  onCreateFile: (parentId: string | null, name: string, type: "file" | "folder") => void;
  fileTree: FileTreeItem[];
}

const Terminal: React.FC<TerminalProps> = ({ onCreateFolder, onCreateFile, fileTree }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; output: string }[]>([
    { command: "", output: "Web Code Editor Terminal v1.0.0" },
    { command: "", output: "Type 'help' for available commands" }
  ]);
  const [currentPath, setCurrentPath] = useState("~/project");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    if (!trimmedCmd) {
      setHistory(prev => [...prev, { command: "", output: "" }]);
      return;
    }

    let output = "";
    const parts = trimmedCmd.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        output = `Available commands:
  help          - Show this help message
  clear         - Clear terminal
  ls            - List files and directories
  mkdir [name]  - Create a new folder
  touch [name]  - Create a new file
  cd [dir]      - Change directory
  pwd           - Print working directory
  echo [text]   - Print text
  npm install   - Simulate npm install
  node -v       - Show Node.js version
  npm -v        - Show npm version`;
        break;
      
      case "clear":
        setHistory([]);
        setInput("");
        return;
      
      case "ls":
        const listFiles = (items: FileTreeItem[]) => {
          return items.map(item => 
            item.type === "folder" ? `${item.name}/` : item.name
          ).join("\n");
        };
        output = fileTree.length > 0 ? listFiles(fileTree) : "(empty directory)";
        break;
      
      case "mkdir":
        if (args.length === 0) {
          output = "mkdir: missing operand\nUsage: mkdir [folder_name]";
        } else {
          const folderName = args[0];
          onCreateFolder(null, folderName, "folder");
          output = `✓ Created folder: ${folderName}`;
        }
        break;
      
      case "touch":
        if (args.length === 0) {
          output = "touch: missing operand\nUsage: touch [file_name]";
        } else {
          const fileName = args[0];
          onCreateFile(null, fileName, "file");
          output = `✓ Created file: ${fileName}`;
        }
        break;
      
      case "cd":
        if (args.length === 0) {
          setCurrentPath("~");
        } else if (args[0] === "..") {
          const pathParts = currentPath.split("/");
          pathParts.pop();
          setCurrentPath(pathParts.join("/") || "~");
        } else {
          setCurrentPath(`${currentPath}/${args[0]}`);
        }
        output = "";
        break;
      
      case "pwd":
        output = currentPath;
        break;
      
      case "echo":
        output = args.join(" ");
        break;
      
      case "npm":
        if (args[0] === "install" || args[0] === "i") {
          output = `npm notice Installing dependencies...
npm notice Created package-lock.json
npm notice Added 234 packages in 12.456s

✓ Dependencies installed successfully!
Note: This is a simulated environment. Real npm functionality requires a backend server.`;
        } else if (args[0] === "-v" || args[0] === "--version") {
          output = "9.8.1";
        } else {
          output = `npm: unknown command '${args[0]}'
Run 'npm help' for usage information`;
        }
        break;
      
      case "node":
        if (args[0] === "-v" || args[0] === "--version") {
          output = "v20.10.0";
        } else {
          output = "Node.js REPL not available in this environment";
        }
        break;
      
      default:
        output = `Command not found: ${command}
Type 'help' for available commands`;
    }

    setHistory(prev => [...prev, { command: trimmedCmd, output }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    }
  };

  if (!isOpen) {
    return (
      <div className="h-10 bg-[#252526] border-t border-[#2D2D30] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} />
          <span className="text-sm">Terminal</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="hover:bg-[#2A2D2E] p-1 rounded transition-colors"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`${isMaximized ? "absolute inset-0 z-30" : "h-64"} bg-[#1E1E1E] border-t border-[#2D2D30] flex flex-col`}>
      {/* Terminal Header */}
      <div className="h-9 bg-[#252526] border-b border-[#2D2D30] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} />
          <span className="text-sm">Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="hover:bg-[#2A2D2E] p-1 rounded transition-colors"
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-[#2A2D2E] p-1 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={outputRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-1">
            {entry.command && (
              <div className="flex gap-2">
                <span className="text-[#4EC9B0]">{currentPath}</span>
                <span className="text-[#D4D4D4]">$</span>
                <span className="text-[#D4D4D4]">{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <div className="text-[#CCCCCC] whitespace-pre-wrap mt-1">{entry.output}</div>
            )}
          </div>
        ))}
        
        <div className="flex gap-2">
          <span className="text-[#4EC9B0]">{currentPath}</span>
          <span className="text-[#D4D4D4]">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[#D4D4D4]"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

