"use client";

import { Button } from "@/components/ui/button";
import { usePanel } from "@/hooks/use-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const { openPanel } = usePanel();

  // Test data for edit/view panels
  const testProjectData = { id: 1, name: "Test Project", status: "active" };
  const testTaskData = { id: 1, title: "Test Task", completed: false };
  const testContactData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Test Panel Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Test Action Panels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project Panel Tests */}
          <div>
            <h3 className="font-semibold mb-2">Project Panels</h3>
            <div className="flex gap-2">
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
            <h3 className="font-semibold mb-2">Task Panels</h3>
            <div className="flex gap-2">
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
            <h3 className="font-semibold mb-2">Contact Panels</h3>
            <div className="flex gap-2">
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

          {/* AI Assistant Test */}
          <div>
            <h3 className="font-semibold mb-2">AI Assistant</h3>
            <Button
              onClick={() => openPanel("ai-assistant")}
              variant="outline"
              size="sm"
            >
              AI Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
