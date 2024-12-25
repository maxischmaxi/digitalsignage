import { Permission } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
  permissions: Permission[];
};

export type NavGroup = {
  title: string;
  permissions: Permission[];
  items: NavItem[];
};
