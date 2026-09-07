 interface DocumentProps {
  params: Promise<{
    documentId: string;
  }>;
 }
 export default async function DocumentIDpage({params}: DocumentProps ) {
  const { documentId } = await params;
  return (
    <div>
      <h1>Document Page</h1>
      <p>ID: {documentId}</p>
    </div>
  );
}
