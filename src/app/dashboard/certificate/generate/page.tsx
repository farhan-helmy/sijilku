import { ContentLayout } from "@/components/admin-panel/content-layout";
import { GenerateCertificatePanel } from "./_components/generate-certificate";

export default function GenerateCertificatePage() {
  return (
    <ContentLayout title="Generate Certificate">
      <GenerateCertificatePanel />
    </ContentLayout>
  );
}
