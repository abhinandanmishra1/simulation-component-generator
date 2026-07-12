import React, { useState, useEffect } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview, LiveContext } from "react-live";
import * as LucideIcons from "lucide-react";

// Scope of variables and components available to the dynamic sandbox
const liveScope = {
  React,
  useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  
  // Spread all Lucide icons to guarantee any requested icon is defined
  ...LucideIcons
};

// Component to read LiveProvider's error state and report it to the parent
function LiveErrorListener({ onHasError }: { onHasError: (error: string | null) => void }) {
  const context = React.useContext(LiveContext);
  
  useEffect(() => {
    if (context && context.error) {
      onHasError(context.error);
    } else {
      onHasError(null);
    }
  }, [context?.error, onHasError]);

  return null;
}

interface ComponentPreviewProps {
  code: string;
  onValidationError?: (error: string | null) => void;
}

export default function ComponentPreview({ code, onValidationError }: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");


  // Robust function to strip imports so react-live doesn't crash on them
  const cleanCodeForPreview = (rawCode: string) => {
    // 1. Strip import statements
    let processed = rawCode.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, "");
    
    // 2. Remove standard module exports / exports that are not supported in live scope
    processed = processed.replace(/export\s+default\s+function\s+([a-zA-Z0-9_$]+)/, "function $1");
    processed = processed.replace(/export\s+default\s+/, "");
    
    // 3. Find the main component name to render
    // Look for standard function declaration first
    const functionMatch = processed.match(/function\s+([a-zA-Z0-9_$]+)/);
    let componentName = "";
    
    if (functionMatch && functionMatch[1]) {
      componentName = functionMatch[1];
    } else {
      // Look for const ComponentName = ...
      const constMatch = processed.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*/);
      if (constMatch && constMatch[1]) {
        componentName = constMatch[1];
      }
    }
    
    // 4. Append the render call if a component name was found
    if (componentName) {
      processed = `${processed}\n\nrender(<${componentName} />);`;
    }
    
    return processed.trim();
  };

  const processedCode = cleanCodeForPreview(code);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card text-card-foreground shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-muted-foreground">Sandbox Live Environment</span>
        </div>
        <div className="flex bg-muted rounded-lg p-0.5 border border-border">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "preview"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "code"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Raw Code View
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[480px] bg-background relative flex flex-col">
        <LiveProvider code={processedCode} scope={liveScope} noInline={true}>
          <LiveErrorListener onHasError={(err) => onValidationError?.(err)} />
          {activeTab === "preview" ? (
            <div className="p-6 flex-1 flex flex-col items-stretch justify-start overflow-auto">
              {/* Dynamic Live Rendering Canvas */}
              <div className="w-full h-full bg-background rounded-xl p-4 border border-dashed border-border/80 min-h-[440px]">
                <LivePreview />
              </div>
              
              {/* Error boundary logging */}
              <div className="mt-4">
                <LiveError className="p-3 bg-red-50 text-red-600 text-xs font-mono rounded-lg border border-red-100 overflow-x-auto" />
              </div>
            </div>
          ) : (
            <div className="flex-1 font-mono text-sm overflow-auto max-h-[550px] bg-[#1e1e1e]">
              <LiveEditor 
                className="font-mono text-sm leading-relaxed p-4"
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  backgroundColor: "#1e1e1e",
                }}
              />
            </div>
          )}
        </LiveProvider>
      </div>
    </div>
  );
}
