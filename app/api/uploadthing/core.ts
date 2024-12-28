import { auth } from "@/lib/auth";
import { findUserByEmail, prisma } from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const uploadThing = createUploadthing();

export const digitalsignageFileRouter = {
  upload: uploadThing({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const data = await auth.getSession();
      if (!data?.user?.email) throw new UploadThingError("Unauthorized");

      const user = await findUserByEmail(data.user.email);

      if (!user?.currentOrg) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.media.create({
        data: {
          userId: metadata.user.id,
          orgId: metadata.user.currentOrg,
          name: file.name,
          key: file.key,
          url: file.url,
          size: file.size,
        },
      });
      return { name: file.name, key: file.key, size: file.size, url: file.url };
    }),
} satisfies FileRouter;

export type DigitalSignageFileRouter = typeof digitalsignageFileRouter;
