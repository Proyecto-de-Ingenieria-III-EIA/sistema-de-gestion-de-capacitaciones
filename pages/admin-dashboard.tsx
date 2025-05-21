import React from "react";
import { AdminDashboard } from "@/components/atomic-design/organisms/admin-dashboard";
import { GET_TRAININGS } from "@/graphql/frontend/trainings";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";

const AdminPage = () => {
  const { data, loading, error } = useQuery(GET_TRAININGS);

  if (loading) return <p>Loading trainings...</p>;
  if (error) return <p>Error loading trainings: {error.message}</p>;

  return <AdminDashboard trainings={data?.getTrainings}/>;
};

export default AdminPage;