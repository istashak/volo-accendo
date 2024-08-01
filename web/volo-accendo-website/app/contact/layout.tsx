export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 100 }} className="flex">
      {children}
    </div>
  );
}
