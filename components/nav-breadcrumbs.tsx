"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDisplays } from "@/hooks/use-displays";
import { useLayouts } from "@/hooks/use-layouts";
import { useOrgs } from "@/hooks/use-orgs";
import { usePathname } from "@/i18n/routing";
import { isUUID } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function NavBreadcrumbs() {
  const pathname = usePathname();
  const { orgId } = useParams();
  const t = useTranslations("Nav");
  const locale = useLocale();
  const orgs = useOrgs();
  const org = orgs.data?.find((org) => org.id === orgId);
  const layouts = useLayouts();
  const displays = useDisplays();

  const crumbs = useMemo(() => {
    const split = pathname
      .split("/")
      .filter(Boolean)
      .filter((path) => path !== orgId);

    const response = split.map((path, index) => {
      if (isUUID(path)) {
        const prev = split[index - 1];

        switch (prev) {
          case "layouts":
            return {
              name: layouts.data?.find((l) => l.id === path)?.name || "Layout",
              href: `/${locale}/${orgId}/layouts/${path}`,
            };
          case "displays":
            return {
              name:
                displays.data?.find((d) => d.id === path)?.name || "Display",
              href: `/${locale}/${orgId}/displays/${path}`,
            };
          default:
            break;
        }
      }

      if (path === "create") {
        const prev = split[index - 1];
        switch (prev) {
          case "layouts":
            return {
              name: t("createLayout"),
              href: `/${locale}/${orgId}/layouts/create`,
            };
          case "displays":
            return {
              name: t("createDisplay"),
              href: `/${locale}/${orgId}/displays/create`,
            };
          default:
            break;
        }
      }

      return {
        name: t(path),
        href: `/${locale}/${orgId}/${split.slice(0, index + 1).join("/")}`,
      };
    });

    if (response.length === 0) {
      response.push({
        name: t("home"),
        href: `/${locale}/${orgId}`,
      });
    }

    return response;
  }, [displays.data, layouts.data, locale, orgId, pathname, t]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={`/${locale}/${orgId}`}>
            {org?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        {crumbs.map((crumb, index) => (
          <div className="flex flex-wrap items-center gap-1.5" key={index}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
            </BreadcrumbItem>

            {index < crumbs.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
