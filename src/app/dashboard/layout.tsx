import { Header, Sidebar } from '@/components/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header siteName="博客管理" />
      <div className="flex flex-1 pt-14">
        <Sidebar />
        <main className="flex-1 p-6 bg-muted/30 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
