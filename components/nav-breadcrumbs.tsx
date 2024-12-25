"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useOrgs } from "@/hooks/use-orgs";
import { usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function NavBreadcrumbs() {
  const pathname = usePathname();
  const { orgId } = useParams();
  const t = useTranslations("NavBreadcrumbs");
  const locale = useLocale();
  const orgs = useOrgs();
  const org = orgs.data?.find((org) => org.id === orgId);

  const crumbs = useMemo(() => {
    const split = pathname
      .split("/")
      .filter(Boolean)
      .filter((path) => path !== orgId);

    const response = split.map((path, index) => {
      return {
        path: t(path),
        href: `/${locale}/${orgId}/${split.slice(0, index + 1).join("/")}`,
      };
    });

    if (response.length === 0) {
      response.push({
        path: t("home"),
        href: `/${locale}/${orgId}`,
      });
    }

    return response;
  }, [locale, orgId, pathname, t]);

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
              <BreadcrumbLink href={crumb.href}>{crumb.path}</BreadcrumbLink>
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
