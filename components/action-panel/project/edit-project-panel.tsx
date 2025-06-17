"use client";

interface EditProjectPanelProps {
  data?: any;
}

export function EditProjectPanel({ data }: EditProjectPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Edit Project</h3>
      <p>Edit project form will go here...</p>
      {data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
