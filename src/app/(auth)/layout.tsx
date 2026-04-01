export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="flex w-full items-center justify-center px-4 py-12 md:py-16">
        {children}
      </div>
    </main>
  );
}
