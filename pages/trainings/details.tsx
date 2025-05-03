import AdminLayout from "@/components/layouts/admin-layout";
import TrainingDetails from "@/components/atomic-design/molecules/training-details";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/main-layout";

const layouts = {
  MainLayout,
  AdminLayout,
};

export default function DetailsPage() {
  const router = useRouter();
  const { id, layout } = router.query;

  const Layout = layouts[layout as keyof typeof layouts] || MainLayout;

  return (
    <Layout>
      <TrainingDetails layout={layout as string}/>
    </Layout>
  );
}