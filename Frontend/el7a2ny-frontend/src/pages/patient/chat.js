import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import Chat from "src/components/Chat/Chat";

const Page = () => {
  return <Chat isPatient={true}/>
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
