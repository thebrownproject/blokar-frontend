"use client";

interface EditContactPanelProps {
  data?: any;
}

export function EditContactPanel({ data }: EditContactPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Edit Contact</h3>
      <p>Edit contact form will go here...</p>
      {data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
