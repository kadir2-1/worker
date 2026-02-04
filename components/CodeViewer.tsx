'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { FileStructure } from './GeneratorInterface';

export default function CodeViewer({ file }: { file: FileStructure }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (file.content) {
            navigator.clipboard.writeText(file.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                <span className="text-sm font-mono text-zinc-400">{file.path}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-green-500" />
                            <span>Kopyalandı</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Kopyala</span>
                        </>
                    )}
                </button>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-zinc-950">
                <pre>
                    <code className="block whitespace-pre">
                        {file.content || '// İçerik yok'}
                    </code>
                </pre>
            </div>
        </div>
    );
}
