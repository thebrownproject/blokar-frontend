"use client";

interface EditDocumentPanelProps {
  data?: any;
}

export function EditDocumentPanel({ data }: EditDocumentPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Edit Document</h3>
      <p>Edit document form will go here...</p>
      {data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
