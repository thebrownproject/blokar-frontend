"use client";

interface ViewProjectPanelProps {
  data?: any;
}

export function ViewProjectPanel({ data }: ViewProjectPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">View Project</h3>
      <p>Project details will go here...</p>
      {data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
