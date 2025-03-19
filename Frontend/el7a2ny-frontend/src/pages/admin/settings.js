import { Layout as DashboardLayout } from "src/layouts/dashboard/admin/layout";
import { SettingsPassword } from "src/components/SettingsPassword";

const Page = () => <SettingsPassword />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
