import { SidebarApp } from "@/components/layout/sidebar";
import { TopBarApp } from "@/components/layout/topbar";
import { ResizablePanelLayout } from "@/components/layout/resizable-layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppProviders } from "@/components/providers/app-providers";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <SidebarProvider>
        <SidebarApp />
        <SidebarInset>
          <TopBarApp />
          <ResizablePanelLayout>{children}</ResizablePanelLayout>
        </SidebarInset>
      </SidebarProvider>
    </AppProviders>
  );
}
