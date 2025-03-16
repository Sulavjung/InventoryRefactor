import { Trash } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./ui/context-menu";

import { ReactNode } from "react";
import { Label } from "./ui/label";

export default function AilesContextMenu({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className="flex flex-row">
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="p-2">
          <Label>Edit Aile</Label>
          <ContextMenuItem>
            Delete
            <ContextMenuShortcut>
              <Trash size={16} color="red" />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
