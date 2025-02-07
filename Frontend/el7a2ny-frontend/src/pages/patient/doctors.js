import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import PatientDoctorsTheme from "src/Themes/PatientDoctorsTheme";
const Page = () => {
  return <PatientDoctorsTheme />;
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
