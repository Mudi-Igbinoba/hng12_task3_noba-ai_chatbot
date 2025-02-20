export default function ChatLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='md:px-12 sm:px-6 px-3 mx-auto min-h-screen flex py-6'>
      {children}
    </section>
  );
}
