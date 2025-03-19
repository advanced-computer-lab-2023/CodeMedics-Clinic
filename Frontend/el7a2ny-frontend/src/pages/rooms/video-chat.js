import { useEffect } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import LoadingSpinner from "src/components/LoadingSpinner";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push(`/rooms/${uuidv4()}`);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <p style={{ fontSize: "2rem", fontWeight: "500", marginBottom: "20px" }}>
        Preparing video chat room, please wait...
      </p>
      <LoadingSpinner />
    </div>
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
