"use client";

import { Button } from "@/components/ui/button";
import { usePanel } from "@/hooks/use-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlaygroundPage() {
  const { openPanel } = usePanel();

  // Test data for edit/view panels
  const testProjectData = { id: 1, name: "Test Project", status: "active" };
  const testTaskData = { id: 1, title: "Test Task", completed: false };
  const testContactData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };
  const testDocumentData = {
    id: 1,
    filename: "plans.pdf",
    category: "Plans & Drawings",
    size: "2.5MB",
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Playground</h1>
        <p className="text-muted-foreground">
          Test and preview all action panels and UI components
        </p>
      </div>

      {/* Action Panel Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Action Panel Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Panel Tests */}
          <div>
            <h3 className="font-semibold mb-3">Project Panels</h3>
            <div className="grid gap-2 auto-fit-buttons">
              <Button
                onClick={() => openPanel("new-project")}
                variant="outline"
                size="sm"
              >
                New Project
              </Button>
              <Button
                onClick={() => openPanel("edit-project", testProjectData)}
                variant="outline"
                size="sm"
              >
                Edit Project
              </Button>
              <Button
                onClick={() => openPanel("view-project", testProjectData)}
                variant="outline"
                size="sm"
              >
                View Project
              </Button>
            </div>
          </div>

          {/* Task Panel Tests */}
          <div>
            <h3 className="font-semibold mb-3">Task Panels</h3>
            <div className="grid gap-2 auto-fit-buttons">
              <Button
                onClick={() => openPanel("new-task")}
                variant="outline"
                size="sm"
              >
                New Task
              </Button>
              <Button
                onClick={() => openPanel("edit-task", testTaskData)}
                variant="outline"
                size="sm"
              >
                Edit Task
              </Button>
              <Button
                onClick={() => openPanel("view-task", testTaskData)}
                variant="outline"
                size="sm"
              >
                View Task
              </Button>
            </div>
          </div>

          {/* Contact Panel Tests */}
          <div>
            <h3 className="font-semibold mb-3">Contact Panels</h3>
            <div className="grid gap-2 auto-fit-buttons">
              <Button
                onClick={() => openPanel("new-contact")}
                variant="outline"
                size="sm"
              >
                New Contact
              </Button>
              <Button
                onClick={() => openPanel("edit-contact", testContactData)}
                variant="outline"
                size="sm"
              >
                Edit Contact
              </Button>
              <Button
                onClick={() => openPanel("view-contact", testContactData)}
                variant="outline"
                size="sm"
              >
                View Contact
              </Button>
            </div>
          </div>

          {/* Document Panel Tests */}
          <div>
            <h3 className="font-semibold mb-3">Document Panels</h3>
            <div className="grid gap-2 auto-fit-buttons">
              <Button
                onClick={() => openPanel("upload-document")}
                variant="outline"
                size="sm"
              >
                Upload Document
              </Button>
              <Button
                onClick={() => openPanel("edit-document", testDocumentData)}
                variant="outline"
                size="sm"
              >
                Edit Document
              </Button>
              <Button
                onClick={() => openPanel("view-document", testDocumentData)}
                variant="outline"
                size="sm"
              >
                View Document
              </Button>
            </div>
          </div>

          {/* AI Assistant Test */}
          <div>
            <h3 className="font-semibold mb-3">Blokar Co-pilot</h3>
            <div className="grid gap-2 auto-fit-buttons">
              <Button
                onClick={() => openPanel("ai-assistant")}
                variant="outline"
                size="sm"
              >
                Blokar Co-pilot
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Test */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Test the quick actions from the sidebar and topbar
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => openPanel("ai-assistant")}
              variant="default"
              size="sm"
            >
              Blokar Co-pilot (Quick Action)
            </Button>
            <Button
              onClick={() => openPanel("new-task")}
              variant="default"
              size="sm"
            >
              New Task (Quick Action)
            </Button>
            <Button
              onClick={() => openPanel("upload-document")}
              variant="default"
              size="sm"
            >
              Upload Documents (Quick Action)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Test Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Sample Project Data:</h4>
            <pre className="text-xs p-3 bg-muted/50 rounded border overflow-auto">
              {JSON.stringify(testProjectData, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Sample Task Data:</h4>
            <pre className="text-xs p-3 bg-muted/50 rounded border overflow-auto">
              {JSON.stringify(testTaskData, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Sample Contact Data:</h4>
            <pre className="text-xs p-3 bg-muted/50 rounded border overflow-auto">
              {JSON.stringify(testContactData, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Sample Document Data:</h4>
            <pre className="text-xs p-3 bg-muted/50 rounded border overflow-auto">
              {JSON.stringify(testDocumentData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
