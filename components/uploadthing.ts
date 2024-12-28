"use client";

import {
  generateUploadDropzone,
  generateUploadButton,
} from "@uploadthing/react";
import type { DigitalSignageFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<DigitalSignageFileRouter>();
export const UploadDropzone =
  generateUploadDropzone<DigitalSignageFileRouter>();
