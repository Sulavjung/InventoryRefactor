import {
  FileText,
  Upload,
  Search,
  Tag,
  AlertCircle,
  Barcode,
} from "lucide-react";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface SidebarGroup {
  name: string;
  items: SidebarItem[];
}

export const sidebarConfig: SidebarGroup[] = [
  {
    name: "Documentation",
    items: [
      {
        title: "Overview",
        url: "/documentation/overview",
        icon: FileText,
      },
      {
        title: "Getting Started",
        url: "/documentation/getting-started",
        icon: Upload,
      },
      {
        title: "SKU Search",
        url: "/documentation/sku-search",
        icon: Search,
      },
      {
        title: "Labels",
        url: "/documentation/labels-and-display",
        icon: Tag,
      },
      {
        title: "Troubleshooting",
        url: "/documentation/troubleshooting",
        icon: AlertCircle,
      },
    ],
  },
  {
    name: "Examples",
    items: [
      {
        title: "Use Case 1",
        url: "/documentation/use-case-1",
        icon: Barcode,
      },
    ],
  },
];
