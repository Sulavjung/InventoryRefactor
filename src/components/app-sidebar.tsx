import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { sidebarConfig } from "@/config/sidebar";

export function AppSidebar() {
  const isActive = (url: string) => {
    return url === window.location.pathname;
  };

  return (
    <Sidebar className="mt-12">
      <SidebarContent>
        {sidebarConfig.length > 0 &&
          sidebarConfig.map((group) => (
            <SidebarGroup key={group.name}>
              <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <a href={item.url}>
                          <item.icon
                            color={isActive(item.url) ? "orange" : "red"}
                            className="mr-2 h-5 w-5"
                          />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
    </Sidebar>
  );
}
