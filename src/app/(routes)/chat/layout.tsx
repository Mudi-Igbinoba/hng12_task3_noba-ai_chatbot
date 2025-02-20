export default function ChatLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='container mx-auto min-h-[inherit] flex py-10'>
      {children}
    </section>
  );
}
