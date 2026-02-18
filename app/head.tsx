export default function Head() {
  return (
    <>
      {/* Preconnect to Supabase for faster data fetching */}
      <link
        rel="preconnect"
        href="https://your-supabase-instance.supabase.co"
      />
    </>
  );
}
