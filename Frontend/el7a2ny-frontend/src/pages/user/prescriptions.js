import { PatientPrescriptionsTheme } from "src/components/Themes/PatientPrescriptionsTheme";
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
const Page = () => {
  return <PatientPrescriptionsTheme />;
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
