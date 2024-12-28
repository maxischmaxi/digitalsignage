"use client";

import { Layout, Map, Monitor, SquareTerminal, Timer } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavGroup, NavItem } from "@/lib/definitions";
import { useUser } from "@auth0/nextjs-auth0";
import { usePermissions } from "@/hooks/use-permissions";
import { Permission } from "@prisma/client";
import { Link, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const groups: NavGroup[] = [
  {
    title: "platform",
    permissions: [Permission.PLATFORM],
    items: [
      {
        title: "displays",
        url: "/displays",
        permissions: [Permission.DISPLAYS_READ],
        icon: Monitor,
      },
      {
        title: "layouts",
        url: "/layouts",
        permissions: [Permission.LAYOUTS_READ],
        icon: Layout,
      },
      {
        title: "timeline",
        url: "/timeline",
        permissions: [Permission.TIMELINE_READ],
        icon: Timer,
      },
      {
        title: "locations",
        url: "/locations",
        permissions: [Permission.LOCATIONS],
        icon: Map,
      },
    ],
  },
  {
    title: "media",
    permissions: [Permission.MEDIA],
    items: [
      {
        title: "media",
        url: "/media",
        icon: SquareTerminal,
        permissions: [Permission.MEDIA],
      },
    ],
  },
];

export function NavMain() {
  const { orgId } = useParams();
  const { user } = useUser();
  const permissions = usePermissions(user);
  const pathname = usePathname();
  const t = useTranslations("Nav");

  function filterPermission(navItem: NavItem): boolean {
    if (navItem.permissions.length === 0) {
      return false;
    }
    return navItem.permissions.some((permission) =>
      permissions.data?.includes(permission),
    );
  }

  return (
    <>
      {groups.map((group, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{t(group.title)}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items?.filter(filterPermission).map((item) => {
              return (
                <SidebarMenuButton
                  isActive={pathname.includes(item.url)}
                  asChild
                  key={item.title}
                >
                  <Link href={`/${orgId}/${item.url}`}>
                    <item.icon />
                    <span>{t(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
