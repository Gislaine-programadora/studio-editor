// src/components/FileExplorer.tsx
import React from "react";
import { FaFolder, FaFolderOpen, FaFileAlt } from "react-icons/fa";
import { VscJson, VscFileCode } from "react-icons/vsc";

export interface FileNode {
  name: string;
  fullPath: string;
  isDir: boolean;
}

interface Props {
  files: FileNode[];
  onSelectFile: (fullPath: string) => void;
  onCreateFile: (name: string) => Promise<void>;
  onCreateFolder: (name: string) => Promise<void>;
}

export default function FileExplorer({ files, onSelectFile, onCreateFile, onCreateFolder }: Props) {
  const getIcon = (name: string) => {
    if (name.endsWith(".json")) return <VscJson className="text-yellow-400" />;
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return <VscFileCode className="text-blue-400" />;
    if (name.endsWith(".js")) return <VscFileCode className="text-yellow-300" />;
    return <FaFileAlt />;
  };

  return (
    <div className="bg-gray-900 text-white w-64 h-full p-3 overflow-auto flex flex-col">
      <h2 className="text-sm font-bold mb-3">EXPLORER</h2>

      <div className="flex-1">
        <ul>
          {files.map((f) => (
            <li key={f.fullPath} className="py-1">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => f.isDir ? null : onSelectFile(f.fullPath)}
              >
                {f.isDir ? <FaFolder className="mr-2 text-yellow-500" /> : <span className="mr-2">{getIcon(f.name)}</span>}
                <span>{f.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <CreateControls onCreateFile={onCreateFile} onCreateFolder={onCreateFolder} />
      </div>
    </div>
  );
}

function CreateControls({ onCreateFile, onCreateFolder }: { onCreateFile: (name: string) => Promise<void>, onCreateFolder: (name: string) => Promise<void> }) {
  const [nm, setNm] = React.useState("");
  return (
    <div>
      <input value={nm} onChange={(e) => setNm(e.target.value)} placeholder="name" className="w-full mb-2 p-1 rounded text-black" />
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 p-1 rounded" onClick={() => { onCreateFile(nm); setNm(""); }}>New File</button>
        <button className="flex-1 bg-gray-600 hover:bg-gray-700 p-1 rounded" onClick={() => { onCreateFolder(nm); setNm(""); }}>New Folder</button>
      </div>
    </div>
  );
}

