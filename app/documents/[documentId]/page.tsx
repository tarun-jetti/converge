import TextEditor from "./editor";

interface DocumentProps {
  params: Promise<{
    documentId: string;
  }>;
  searchParams: Promise<{
    template?: string;
  }>;
}

export default async function DocumentIDpage({ params, searchParams }: DocumentProps) {
  const { documentId } = await params;
  const { template } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50/60 selection:bg-indigo-500/15">
      <TextEditor documentId={documentId} initialTemplateId={template} />
    </div>
  );
}
