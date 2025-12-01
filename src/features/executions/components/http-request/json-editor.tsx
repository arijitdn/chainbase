/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";

export const JsonEditor = ({ value, onChange, className }: any) => {
  const handleEditorWillMount = (monaco: any) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false,
    });
  };

  return (
    <div
      className={cn(
        "h-20 text-sm border rounded-md overflow-hidden",
        className,
      )}
    >
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        onChange={onChange}
        theme="vs-light"
        beforeMount={handleEditorWillMount}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          fontSize: 14,
          formatOnPaste: false,
          formatOnType: false,
          lineNumbers: "off",
          glyphMargin: false,
          lineDecorationsWidth: 0,
        }}
      />
    </div>
  );
};
