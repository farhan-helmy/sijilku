import { CertificateEditMenu } from "../generate/_components/certificate-edit-menu";
import { getTemplate } from "./_lib/actions";

export default async function EditCertificatePage({
  params,
}: {
  params: { templateId: string };
}) {
  const template = await getTemplate({ templateId: params.templateId });

  console.log(template);
  return <div>{/* <CertificateEditMenu  /> */}</div>;
}
