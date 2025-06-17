"use client";

interface EditTaskPanelProps {
  data?: any;
}

export function EditTaskPanel({ data }: EditTaskPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Edit Task</h3>
      <p>Edit task form will go here...</p>
      {data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
