import React from "react";
import { useQuery } from "@apollo/client"; // Import Apollo Client's useQuery hook
import { GET_TRAININGS_BY_USER } from "@/graphql/frontend/trainings"; // Import the query
import { TrainingsList } from "@/components/atomic-design/organisms/trainings-list";
import { useSession } from "next-auth/react"; // Import useSession from next-auth
import { useRouter } from "next/router";

const Home = () => {
  const { data: session } = useSession(); // Get session and status from next-auth
  console.log("Session data:", session); // Log session data for debugging
  const router = useRouter(); // Get router from next/router

  // Use Apollo Client's useQuery hook to fetch trainings
  const { data, loading, error } = useQuery(GET_TRAININGS_BY_USER, {
    variables: { userId: session?.user?.id }, // Pass the userId from the session
    skip: !session?.user?.id, // Skip the query if userId is not available
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