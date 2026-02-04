import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-4">
            <main className="flex flex-col items-center gap-4 text-center max-w-2xl">
                <h1 className="text-2xl" style={{ fontSize: '3rem', letterSpacing: '-0.05em' }}>
                    Shopify AI Storefront
                </h1>
                <p className="text-muted" style={{ fontSize: '1.25rem' }}>
                    Saniyeler içinde doğal dil ile satış odaklı Shopify temaları oluşturun.
                </p>

                <div className="flex gap-4 mt-4">
                    <Link href="/auth/login" className="btn btn-primary" style={{ height: '3rem', fontSize: '1rem', padding: '0 2rem' }}>
                        Hemen Başla
                    </Link>
                </div>
            </main>
        </div>
    );
}
