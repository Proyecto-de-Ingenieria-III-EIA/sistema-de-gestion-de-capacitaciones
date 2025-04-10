import React from "react";
import { useQuery } from "@apollo/client"; 
import { GET_TRAININGS_BY_USER } from "@/graphql/frontend/trainings"; 
import { TrainingsList } from "@/components/atomic-design/organisms/trainings-list";
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/router";

const Home = () => {
  const { data: session } = useSession(); 
  const router = useRouter(); 

  const { data, loading, error } = useQuery(GET_TRAININGS_BY_USER, {
    variables: { userId: session?.user?.id }, 
    skip: !session?.user?.id, 
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="h-full w-full">

      {/* Main Content */}
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ongoing Trainings</h1>
        </div>

        {/* Trainings List */}
        <TrainingsList
          trainings={data?.getTrainingsByUser || []}
          buttons={[
            {
              label: "View Training",
              onClick: (training) => router.push(`/trainings/${training.id}`), // Redirect to training-specific page
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Home;