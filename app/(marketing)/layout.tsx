import { SmoothScroll } from "@/components/landing/smooth-scroll";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground font-landing">
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
