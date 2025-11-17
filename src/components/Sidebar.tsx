import React, { useState } from "react";
import { FileTreeItem } from "../types";
import {FolderOpen, Folder, FileText, Plus, Trash2, ChevronRight, ChevronDown} from 'lucide-react';

interface SidebarProps {
  fileTree: FileTreeItem[];
  onFileSelect: (file: FileTreeItem) => void;
  onCreateItem: (parentId: string | null, name: string, type: "file" | "folder") => void;
  onDeleteItem: (id: string) => void;
  currentFile: FileTreeItem | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  fileTree,
  onFileSelect,
  onCreateItem,
  onDeleteItem,
  currentFile
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["1"]));
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileTreeItem | null } | null>(null);
  const [createModal, setCreateModal] = useState<{ parentId: string | null; type: "file" | "folder" } | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileTreeItem | null) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleCreateItem = () => {
    if (newItemName.trim() && createModal) {
      onCreateItem(createModal.parentId, newItemName.trim(), createModal.type);
      setNewItemName("");
      setCreateModal(null);
    }
  };

  const renderTree = (items: FileTreeItem[], depth: number = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#2A2D2E] transition-colors ${
            currentFile?.id === item.id ? "bg-[#37373D]" : ""
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => item.type === "file" ? onFileSelect(item) : toggleFolder(item.id)}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          {item.type === "folder" && (
            <span className="w-4 h-4 flex items-center justify-center">
              {expandedFolders.has(item.id) ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </span>
          )}
          {item.type === "folder" ? (
            expandedFolders.has(item.id) ? (
              <FolderOpen size={16} className="text-[#DCAA5F]" />
            ) : (
              <Folder size={16} className="text-[#DCAA5F]" />
            )
          ) : (
            <FileText size={16} className="text-[#519ABA]" />
          )}
          <span className="text-sm flex-1">{item.name}</span>
        </div>
        {item.type === "folder" && expandedFolders.has(item.id) && item.children && (
          <div>{renderTree(item.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <>
      <div className="w-64 bg-[#252526] border-r border-[#2D2D30] flex flex-col">
        <div className="h-9 flex items-center justify-between px-4 border-b border-[#2D2D30]">
          <span className="text-xs font-semibold uppercase text-[#CCCCCC]">Explorer</span>
          <button
            onClick={() => setCreateModal({ parentId: null, type: "file" })}
            className="hover:bg-[#2A2D2E] p-1 rounded transition-colors"
            title="New File"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div
          className="flex-1 overflow-auto"
          onContextMenu={(e) => handleContextMenu(e, null)}
        >
          {renderTree(fileTree)}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-[#3C3C3C] border border-[#454545] rounded shadow-lg py-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#2A2D2E] flex items-center gap-2"
              onClick={() => {
                setCreateModal({ parentId: contextMenu.item?.id || null, type: "file" });
                setContextMenu(null);
              }}
            >
              <FileText size={14} />
              New File
            </button>
            <button
              className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#2A2D2E] flex items-center gap-2"
              onClick={() => {
                setCreateModal({ parentId: contextMenu.item?.id || null, type: "folder" });
                setContextMenu(null);
              }}
            >
              <Folder size={14} />
              New Folder
            </button>
            {contextMenu.item && (
              <>
                <div className="h-px bg-[#454545] my-1" />
                <button
                  className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#2A2D2E] flex items-center gap-2 text-[#F48771]"
                  onClick={() => {
                    onDeleteItem(contextMenu.item!.id);
                    setContextMenu(null);
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Create Item Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#252526] border border-[#454545] rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              Create New {createModal.type === "file" ? "File" : "Folder"}
            </h3>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateItem()}
              placeholder={`Enter ${createModal.type} name...`}
              className="w-full bg-[#3C3C3C] border border-[#454545] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007ACC]"
              autoFocus
            />
            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={() => {
                  setCreateModal(null);
                  setNewItemName("");
                }}
                className="px-4 py-2 text-sm bg-[#3C3C3C] hover:bg-[#4C4C4C] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
                className="px-4 py-2 text-sm bg-[#007ACC] hover:bg-[#0098FF] rounded transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
