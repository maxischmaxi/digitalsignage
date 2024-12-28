"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadDropzone } from "@/components/uploadthing";
import { useDeleteMedia } from "@/hooks/use-delete-media";
import { useMedia } from "@/hooks/use-media";
import { humanFileSize } from "@/lib/utils";
import { Media } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Page() {
  const media = useMedia();
  const deleteMedia = useDeleteMedia();
  const mediaT = useTranslations("Media");
  const t = useTranslations();

  async function onDelete(file: Media) {
    await deleteMedia.mutateAsync({ id: file.id });
    await media.refetch();
  }

  return (
    <div className="p-4">
      <UploadDropzone
        endpoint="upload"
        onUploadError={(error) => {
          console.error(error);
        }}
        onClientUploadComplete={async () => {
          await media.refetch();
        }}
      />
      <Table>
        <TableCaption>{mediaT("tableTitle")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">{mediaT("name")}</TableHead>
            <TableHead>{mediaT("size")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {media.data?.map((file) => (
            <TableRow key={file.id}>
              <TableCell>
                <Link
                  href={file.url}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {file.name}
                </Link>
              </TableCell>
              <TableCell>{humanFileSize(file.size)}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  onClick={async () => await onDelete(file)}
                  loading={deleteMedia.isPending}
                  disabled={deleteMedia.isPending}
                  variant="destructive"
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
