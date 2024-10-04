import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CertificatePage() {
  return (
    <ContentLayout title="Generate Certificate">
      <div className="flex items-end justify-between">
        <div>Certificate Lists</div>
        <Link href="/dashboard/certificate/generate">
          <Button className="gap-1">
            Generate
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </ContentLayout>
  );
}
