"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocations } from "@/hooks/use-locations";
import { useTranslations } from "next-intl";

export default function Page() {
  const locations = useLocations();
  const t = useTranslations("Locations");

  return (
    <div className="p-4">
      <Table>
        <TableCaption>{t("tableTitle")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">{t("name")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.data?.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.description}</TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
