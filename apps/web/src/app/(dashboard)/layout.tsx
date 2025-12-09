export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full flex-col">
            <header className="border-b px-6 py-4">
                <h1 className="text-xl font-bold">College ERP</h1>
            </header>
            <div className="flex flex-1">
                <aside className="w-64 border-r p-4 hidden md:block">
                    <nav className="space-y-2">
                        <a href="/admissions" className="block p-2 hover:bg-slate-100 rounded">Admissions</a>
                        <a href="/students" className="block p-2 hover:bg-slate-100 rounded">Students</a>
                        <a href="/academics" className="block p-2 hover:bg-slate-100 rounded">Academics</a>
                    </nav>
                </aside>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
