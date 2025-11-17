import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Terminal from "./components/Terminal";
import { FileTreeItem } from "./types";

function App() {
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileTreeItem | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const savedTree = localStorage.getItem("fileTree");
    const savedContents = localStorage.getItem("fileContents");
    
    if (savedTree) {
      setFileTree(JSON.parse(savedTree));
    } else {
      // Initialize with default structure
      const defaultTree: FileTreeItem[] = [
        {
          id: "1",
          name: "src",
          type: "folder",
          children: [
            { id: "2", name: "index.js", type: "file" },
            { id: "3", name: "styles.css", type: "file" }
          ]
        },
        { id: "4", name: "package.json", type: "file" }
      ];
      setFileTree(defaultTree);
    }
    
    if (savedContents) {
      setFileContents(JSON.parse(savedContents));
    }
  }, []);

  // Save to localStorage whenever fileTree or fileContents change
  useEffect(() => {
    if (fileTree.length > 0) {
      localStorage.setItem("fileTree", JSON.stringify(fileTree));
    }
  }, [fileTree]);

  useEffect(() => {
    localStorage.setItem("fileContents", JSON.stringify(fileContents));
  }, [fileContents]);

  const handleFileSelect = (file: FileTreeItem) => {
    if (file.type === "file") {
      setCurrentFile(file);
    }
  };

  const handleFileContentChange = (content: string) => {
    if (currentFile) {
      setFileContents(prev => ({
        ...prev,
        [currentFile.id]: content
      }));
    }
  };

  const handleCreateItem = (parentId: string | null, name: string, type: "file" | "folder") => {
    const newItem: FileTreeItem = {
      id: Date.now().toString(),
      name,
      type,
      children: type === "folder" ? [] : undefined
    };

    if (parentId === null) {
      setFileTree(prev => [...prev, newItem]);
    } else {
      const addToTree = (items: FileTreeItem[]): FileTreeItem[] => {
        return items.map(item => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newItem]
            };
          }
          if (item.children) {
            return {
              ...item,
              children: addToTree(item.children)
            };
          }
          return item;
        });
      };
      setFileTree(prev => addToTree(prev));
    }
  };

  const handleDeleteItem = (id: string) => {
    const deleteFromTree = (items: FileTreeItem[]): FileTreeItem[] => {
      return items.filter(item => {
        if (item.id === id) {
          return false;
        }
        if (item.children) {
          item.children = deleteFromTree(item.children);
        }
        return true;
      });
    };
    setFileTree(prev => deleteFromTree(prev));
    
    if (currentFile?.id === id) {
      setCurrentFile(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1E1E1E] text-[#D4D4D4]">
      {/* Top Bar */}
      <div className="h-9 bg-[#323233] flex items-center px-4 border-b border-[#2D2D30]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
        </div>
        <div className="ml-6 text-sm font-medium">Web Code Editor</div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          fileTree={fileTree}
          onFileSelect={handleFileSelect}
          onCreateItem={handleCreateItem}
          onDeleteItem={handleDeleteItem}
          currentFile={currentFile}
        />
        
        <div className="flex-1 flex flex-col">
          <Editor
            file={currentFile}
            content={currentFile ? (fileContents[currentFile.id] || "") : ""}
            onContentChange={handleFileContentChange}
          />
          
          <Terminal 
            onCreateFolder={handleCreateItem}
            onCreateFile={handleCreateItem}
            fileTree={fileTree}
          />
        </div>
      </div>
    </div>
  );
}

export default App;