'use client';

import { Folder, FileCode, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { FileStructure } from './GeneratorInterface';

interface FileExplorerProps {
    files: FileStructure[];
    onSelect: (file: FileStructure) => void;
    selectedFile: FileStructure | null;
    level?: number;
}

export default function FileExplorer({ files, onSelect, selectedFile, level = 0 }: FileExplorerProps) {
    return (
        <div className="text-sm">
            {files.map((item) => (
                <FileItem
                    key={item.path}
                    item={item}
                    onSelect={onSelect}
                    selectedFile={selectedFile}
                    level={level}
                />
            ))}
        </div>
    );
}

function FileItem({ item, onSelect, selectedFile, level }: {
    item: FileStructure,
    onSelect: (file: FileStructure) => void,
    selectedFile: FileStructure | null,
    level: number
}) {
    const [isOpen, setIsOpen] = useState(true);
    const isSelected = selectedFile?.path === item.path;

    const handleClick = () => {
        if (item.type === 'folder') {
            setIsOpen(!isOpen);
        } else {
            onSelect(item);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
                className={`flex items-center gap-1.5 py-1.5 px-3 cursor-pointer select-none hover:bg-zinc-200 dark:hover:bg-zinc-800 ${isSelected ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium' : 'text-zinc-600 dark:text-zinc-400'}`}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
                {item.type === 'folder' && (
                    <span className="text-zinc-400">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
                {item.type === 'folder' ? (
                    <Folder size={16} className="text-blue-500 fill-blue-500/20" />
                ) : (
                    <FileCode size={16} className="text-emerald-500" />
                )}
                <span className="truncate">{item.name}</span>
            </div>

            {item.type === 'folder' && isOpen && item.children && (
                <FileExplorer
                    files={item.children}
                    onSelect={onSelect}
                    selectedFile={selectedFile}
                    level={level + 1}
                />
            )}
        </div>
    );
}
