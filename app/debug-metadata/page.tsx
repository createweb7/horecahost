import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Page - Hamilton Beach Meta Test',
  description: 'This is a test description for Hamilton Beach from database metadata',
  keywords: 'test,meta,tags,hamilton,beach',
};

export default function DebugMetadataPage() {
  return (
    <main className="p-8">
      <h1>Debug Metadata Page</h1>
      <p>Check the page source to verify meta tags are in the HEAD section.</p>
      <pre>{`
Expected in <head>:
<title>Test Page - Hamilton Beach Meta Test</title>
<meta name="description" content="This is a test description..." />
<meta name="keywords" content="test,meta,tags..." />
      `}</pre>
    </main>
  );
}
