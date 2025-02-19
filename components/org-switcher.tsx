"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, icons } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/routing";
import { useOrgs } from "@/hooks/use-orgs";
import { useTranslations } from "next-intl";

export function OrgSwitcher() {
  const { orgId } = useParams();
  const { isMobile } = useSidebar();
  const orgs = useOrgs();
  const pathname = usePathname();
  const t = useTranslations("OrgSwitcher");

  const org = orgs.data?.find((org) => org.id === orgId);

  const ActiveOrgIcon = icons[(org?.icon ?? "House") as keyof typeof icons];

  const actualPath = pathname.split("/").filter(Boolean).slice(1).join("/");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ActiveOrgIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{org?.name}</span>
                <span className="truncate text-xs">{org?.Plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t("organization")}
            </DropdownMenuLabel>
            {orgs.data
              ?.filter((org) => org.id !== orgId)
              .map((org) => {
                const Icon = icons["House"];

                return (
                  <DropdownMenuItem key={org.id} className="gap-2 p-2" asChild>
                    <Link href={`/${org.id}/${actualPath}`}>
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <Icon className="size-4" />
                      </div>
                      {org.name}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href="/create-org">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  {t("addOrganization")}
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
