'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
    mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'register') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // For simplicity, we assume auto-login or redirect to a "check email" page
                // But for this demo, we might just redirect to login if email confirmation is on
                // Or if disabled, just go to dashboard.
                // Let's assume sending them to login with a message.
                alert('Kayıt başarılı! Lütfen giriş yapın.');
                router.push('/auth/login');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col space-y-1.5 text-center mb-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                </h3>
                <p className="text-sm text-muted">
                    {mode === 'login'
                        ? 'Hesabınıza erişmek için bilgilerinizi girin'
                        : 'Yeni tasarımlar oluşturmak için kayıt olun'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                        <input
                            id="email"
                            type="email"
                            placeholder="ornek@sirket.com"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="password">Şifre</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                        <input
                            id="password"
                            type="password"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-sm font-medium text-red-500">
                        Hata: {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
            </form>

            <div className="mt-4 text-center text-sm">
                {mode === 'login' ? (
                    <p>
                        Hesabınız yok mu?{' '}
                        <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
                            Kayıt Ol
                        </Link>
                    </p>
                ) : (
                    <p>
                        Zaten hesabınız var mı?{' '}
                        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                            Giriş Yap
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
