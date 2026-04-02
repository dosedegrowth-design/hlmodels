import { BrandHeader } from "@/components/marcas/brand-header";

export default function MarcasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <BrandHeader />
      <main>{children}</main>
    </div>
  );
}
