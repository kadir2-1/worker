'use client';

import { useState } from 'react';
import { Send, Loader2, Download, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FileExplorer from './FileExplorer';
import CodeViewer from './CodeViewer';

export type FileStructure = {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileStructure[];
    path: string;
};

export default function GeneratorInterface() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileStructure[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileStructure | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) throw new Error('Generation failed');

            const data = await res.json();
            setFiles(data.files);

            // Save to Supabase
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await supabase.from('generations').insert({
                    user_id: session.user.id,
                    prompt: prompt,
                    result: data.files,
                });
            }

            // Select first file by default
            if (data.files && data.files[0] && data.files[0].children?.[0]) {
                setSelectedFile(data.files[0].children[0]);
            }
        } catch (error) {
            console.error(error);
            alert('Tema oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            {/* Input Area */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex gap-2">
                    <textarea
                        className="flex-1 p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder:text-muted-foreground"
                        placeholder="Örn: Minimalist, siyah beyaz ağırlıklı, büyük görselli bir moda mağazası tasarla. Ana sayfada kayan yazı banner'ı olsun."
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="flex flex-col items-center justify-center px-6 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {loading ? <Loader2 className="animate-spin mb-1" /> : <Send className="mb-1" />}
                        <span>{loading ? 'Üretiliyor...' : 'Oluştur'}</span>
                    </button>
                </div>
            </div>

            {/* Results Area */}
            <div className="flex flex-1 overflow-hidden">
                {files.length > 0 ? (
                    <>
                        {/* File Explorer */}
                        <div className="w-1/4 min-w-[200px] border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-y-auto">
                            <FileExplorer
                                files={files}
                                onSelect={setSelectedFile}
                                selectedFile={selectedFile}
                            />
                        </div>

                        {/* Code Viewer */}
                        <div className="flex-1 overflow-hidden bg-zinc-950 text-zinc-50 flex flex-col">
                            {selectedFile ? (
                                <CodeViewer file={selectedFile} />
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-zinc-500">
                                    Dosya seçin
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-zinc-50/20">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 text-zinc-400" />
                        </div>
                        <p className="max-w-sm">
                            Sol üstteki alana nasıl bir mağaza istediğinizi yazın ve "Oluştur" butonuna basın.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
