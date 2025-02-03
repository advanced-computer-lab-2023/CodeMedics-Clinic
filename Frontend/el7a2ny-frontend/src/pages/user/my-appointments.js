import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import PatientAppointmentTheme from 'src/Themes/PatientAppointmentTheme';

const Page = () => {
  return <PatientAppointmentTheme/>
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
