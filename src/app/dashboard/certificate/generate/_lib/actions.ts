"use server";

import { db } from "@/db";
import { NewTemplate, template } from "@/db/schema";
import { handleApiRequest } from "@/lib/utils";

export async function saveTemplate(templateData: NewTemplate) {
  return handleApiRequest(async () => {
    const res = await db.insert(template).values(templateData).returning({
      id: template.id,
    });

    console.log(res);
  });
}
