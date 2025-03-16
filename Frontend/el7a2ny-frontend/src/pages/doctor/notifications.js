import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import Notifications from "src/components/Notifications";

const Page = () => {
  return <Notifications />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
