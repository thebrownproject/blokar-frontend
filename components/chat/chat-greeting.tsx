'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';

/**
 * ChatGreeting - Welcome message for empty chat
 * 
 * Shows when no messages are present, providing a welcoming
 * introduction to Blokar Copilot. Based on Vercel's Greeting
 * component but customized for Blokar.
 */
export function ChatGreeting() {
  return (
    <div className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center">
      {/* Main Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center mb-6"
      >
        <div className="relative">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-primary" />
          </div>
        </div>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-2"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome to Blokar Copilot
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-lg text-muted-foreground">
          Your AI assistant for construction project management
        </p>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
      >
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600 dark:text-blue-400">🏗️</span>
          </div>
          <h3 className="font-medium text-sm text-foreground mb-1">Project Management</h3>
          <p className="text-xs text-muted-foreground">Manage projects, tasks, and deadlines</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 dark:text-green-400">📊</span>
          </div>
          <h3 className="font-medium text-sm text-foreground mb-1">Analytics & Reports</h3>
          <p className="text-xs text-muted-foreground">Get insights on project progress</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600 dark:text-purple-400">🤖</span>
          </div>
          <h3 className="font-medium text-sm text-foreground mb-1">AI Assistance</h3>
          <p className="text-xs text-muted-foreground">Smart help for construction workflows</p>
        </div>
      </motion.div>
    </div>
  );
}
