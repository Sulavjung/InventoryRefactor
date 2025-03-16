
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import MyForm from "@/components/setting-form";

type SettingType = {
  data?: File[];
  whichCQR?: string;
  showIdentifier?: boolean;
  showName?: boolean;
  showPrice?: boolean;
  showSize?: boolean;
  whichCName?: string;
  whichCPrice?: string;
  whichCSize?: string;
};

export default function Dashboard() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Dashboard</PageHeaderHeading>
      </PageHeader>
      <MyForm />
    </>
  );
}
