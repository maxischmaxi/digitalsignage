"use client";

import {
  BookOpen,
  ChevronRight,
  Frame,
  PieChart,
  Settings2,
  SquareTerminal,
  GalleryVertical,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavGroup, NavItem } from "@/lib/definitions";
import { useUser } from "@auth0/nextjs-auth0";
import { usePermissions } from "@/hooks/use-permissions";
import { Permission } from "@prisma/client";
import { Link, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";

const groups: NavGroup[] = [
  {
    title: "Platform",
    permissions: [Permission.PLATFORM],
    items: [
      {
        title: "Signage",
        url: "/signage",
        icon: SquareTerminal,
        permissions: [Permission.SIGNAGE_READ],
        items: [
          {
            title: "Displays",
            url: "/displays",
            permissions: [Permission.DISPLAYS_READ],
          },
          {
            title: "Layouts",
            url: "/layouts",
            permissions: [Permission.LAYOUTS_READ],
          },
          {
            title: "Timeline",
            url: "/timeline",
            permissions: [Permission.TIMELINE_READ],
          },
        ],
      },
      {
        title: "Documentation",
        url: "/docs",
        icon: BookOpen,
        permissions: [],
        items: [
          {
            title: "Introduction",
            url: "#",
            permissions: [],
          },
          {
            title: "Get Started",
            url: "#",
            permissions: [],
          },
          {
            title: "Tutorials",
            url: "#",
            permissions: [],
          },
          {
            title: "Changelog",
            url: "#",
            permissions: [],
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        permissions: [],
        items: [
          {
            title: "General",
            url: "#",
            permissions: [],
          },
          {
            title: "Team",
            url: "#",
            permissions: [],
          },
          {
            title: "Billing",
            url: "#",
            permissions: [],
          },
          {
            title: "Limits",
            url: "#",
            permissions: [],
          },
        ],
      },
    ],
  },
  {
    title: "Media",
    permissions: [Permission.MEDIA],
    items: [
      {
        title: "Images",
        url: "/images",
        icon: Frame,
        permissions: [Permission.IMAGES_READ],
        items: [
          {
            title: "Gallery",
            url: "/gallery",
            permissions: [Permission.IMAGES_READ],
            icon: GalleryVertical,
          },
        ],
      },
      {
        title: "Videos",
        url: "/videos",
        icon: PieChart,
        permissions: [Permission.VIDEOS_READ],
      },
    ],
  },
];

export function NavMain() {
  const { orgId } = useParams();
  const { user } = useUser();
  const permissions = usePermissions(user);
  const pathname = usePathname();

  function filterPermission(navItem: NavItem): boolean {
    if (navItem.permissions.length === 0) {
      return false;
    }
    return navItem.permissions.some((permission) =>
      permissions.data?.includes(permission),
    );
  }

  const parts = pathname.split("/").filter(Boolean).slice(1);

  return (
    <>
      {groups.map((group, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.filter(filterPermission).map((item) => {
              const isActive = `/${parts[0]}` === item.url;

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.filter(filterPermission).map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={`/${orgId}/${item.url}/${subItem.url}`}
                              >
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
