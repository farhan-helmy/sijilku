"use server";

import { db } from "@/db";
import { template } from "@/db/schema";
import { handleApiRequest } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function getTemplate({ templateId }: { templateId: string }) {
  return handleApiRequest(async () => {
    return await db.query.template.findFirst({
      where: eq(template.id, templateId),
    });
  });
}
