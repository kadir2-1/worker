import GeneratorInterface from '@/components/GeneratorInterface';

export default function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Yeni Tema Oluştur</h1>
                <p className="text-muted mt-2">
                    Shopify mağazanız için hayalinizdeki tasarımı tarif edin, AI sizin için kodlasın.
                </p>
            </header>

            <GeneratorInterface />
        </div>
    );
}
