// Replace the form section with:
<div className="border-t p-4">
  <ChatInput
    onSendMessage={(message) => {
      // This won't work directly with useChat
      // Keep the inline form approach above
    }}
    disabled={isLoading}
    placeholder="Ask about your projects..."
  />
</div>;
