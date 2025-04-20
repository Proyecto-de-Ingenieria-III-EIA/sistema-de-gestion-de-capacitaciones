import AdminLayout from "@/components/layouts/admin-layout";
import TrainingDetails from "@/components/atomic-design/molecules/training-details";
import { useRouter } from "next/router";

export default function DetailsPage() {
  const router = useRouter();

  return (
    <AdminLayout>
      <TrainingDetails />
    </AdminLayout>
  );
}