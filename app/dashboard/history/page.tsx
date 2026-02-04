'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileCode, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Generation {
    id: string;
    prompt: string;
    created_at: string;
    result: any;
}

export default function HistoryPage() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data, error } = await supabase
                .from('generations')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching history:', error);
            } else {
                setGenerations(data || []);
            }
            setLoading(false);
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-zinc-500">Yükleniyor...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Geçmiş Tasarımlar</h1>

            <div className="space-y-4">
                {generations.length === 0 ? (
                    <div className="text-muted-foreground">Henüz kaydedilmiş bir tasarımınız yok.</div>
                ) : (
                    generations.map((gen) => (
                        <div key={gen.id} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium text-lg mb-1 truncate max-w-xl">{gen.prompt}</h3>
                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                        <Calendar size={14} />
                                        <span>{new Date(gen.created_at).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                                {/* In a real app we would link to a detail view, but for now we haven't built a detail view route distinct from the dashboard. */}
                                <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Görüntüle <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
