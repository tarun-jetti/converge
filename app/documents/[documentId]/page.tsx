 import TextEditor from './editor'
 interface DocumentProps {
  params: Promise<{
    documentId: string;
  }>;
 }
 export default async function DocumentIDpage({params}: DocumentProps ) {
  const { documentId } = await params;
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 ">
      <TextEditor />
    </div>
  );
}
