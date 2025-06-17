"use client";

interface ViewDocumentPanelProps {
  data?: any;
}

export function ViewDocumentPanel({ data }: ViewDocumentPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">View Document</h3>
      <p>Document details will go here...</p>
      {data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
