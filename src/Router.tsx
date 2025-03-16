import { createBrowserRouter } from "react-router-dom";
import { Applayout } from "./components/layouts/AppLayout";
import DocumentationLayout from "./components/layouts/DocumentationLayout";
import ReactMarkdown from "react-markdown";
import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard";
import Empty from "./pages/Empty";
import React, { useState, useEffect } from "react";
import CreatorLayout from "./components/layouts/CreatorLayout";
import AisleShelfDetails from "@/pages/AileShelfDetails";

// Dynamically import Markdown files
const markdownModules = import.meta.glob("../src/docs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

console.log("Markdown Modules:", markdownModules);

// Markdown rendering component
function MarkdownPage({ filePath }: { filePath: string }) {
  const [content, setContent] = useState<string>(""); // State for Markdown content

  useEffect(() => {
    // Set the Markdown content from the imported modules
    if (markdownModules[filePath]) {
      setContent(markdownModules[filePath] as unknown as string);
    } else {
      console.error(`Markdown file not found: ${filePath}`);
      setContent("Error: File not found.");
    }
  }, [filePath]);

  return (
    <article className="prose md:prose-base prose-sm dark:prose-invert">
      <br />
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}

// Generate routes dynamically for Markdown files
const documentationRoutes = Object.keys(markdownModules).map((filePath) => {
  const fileName = filePath.split("/").pop()?.replace(".md", ""); // Extract file name without extension
  const routePath = fileName === "index" ? "" : fileName; // Default route for `index.md`

  return {
    path: routePath,
    element: <MarkdownPage filePath={filePath} />, // Render MarkdownPage component
  };
});
console.log("Generated Documentation Routes:", documentationRoutes);

// Main router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Applayout />,
    children: [
      {
        path: "",
        element: <CreatorLayout />,
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "aile/:aisleId/shelf/:shelveId", 
            element: <AisleShelfDetails />,
          },
        ],
      },
      {
        path: "documentation",
        element: <DocumentationLayout />,
        children: documentationRoutes,
      },
      {
        path: "empty",
        element: <Empty />,
      },
    ],
  },
  {
    path: "*",
    element: <NoMatch />,
  },
]);
