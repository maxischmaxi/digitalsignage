import { createRouteHandler } from "uploadthing/next";
import { digitalsignageFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: digitalsignageFileRouter,
  config: {
    isDev: process.env.NODE_ENV === "development",
    callbackUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/uploadthing"
        : "https://digitalsignage.jeschek.dev/api/uploadthing",
  },
});
