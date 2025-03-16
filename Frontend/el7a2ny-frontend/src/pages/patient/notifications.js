import Notifications from "src/components/Notifications";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
const Page = () => {
  return <Notifications />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
