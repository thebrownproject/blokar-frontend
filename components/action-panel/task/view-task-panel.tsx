"use client";

interface ViewTaskPanelProps {
  data?: any;
}

export function ViewTaskPanel({ data }: ViewTaskPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">View Task</h3>
      <p>Task details will go here...</p>
      {data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
