import React from "react";
import { useQuery } from "@apollo/client"; 
import { GET_TRAININGS_BY_INSTRUCTOR, GET_TRAININGS_BY_USER } from "@/graphql/frontend/trainings"; 
import { TrainingsList } from "@/components/atomic-design/organisms/trainings-list";
import { signIn, useSession } from "next-auth/react"; 
import { useRouter } from "next/router";
import { Training } from "@prisma/client";
import MainLayout from "../layouts/main-layout";

const Home = () => {
  const { data: session, status } = useSession(); 
  const router = useRouter(); 

  const { data, loading, error } = useQuery(GET_TRAININGS_BY_USER, {
    variables: { userId: session?.user?.id }, 
    skip: !session?.user?.id, 
  });

  const { data: instructing } = useQuery(GET_TRAININGS_BY_INSTRUCTOR, {
    variables: { instructorId: session?.user?.id },
    skip: !session?.user?.id || session.user?.roleId !== 2,
  });

  const handleNavigation = (training: Training, path: string, Layout: React.FC<{ children: React.ReactNode }>) => {
    localStorage.setItem("selectedTraining", JSON.stringify(training));
    router.push({
      pathname: path,
      query: { 
        id: training.id,
        layout: Layout.name 
      }, 
    });
  };

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
              onClick: (training) => router.push(`/trainings/user?id=${training.id}`),
            },
          ]}
        />

        {/* Instructing List */}
        {session?.user?.roleId === 2 && (
          <>
            <h2 className="text-2xl font-bold mt-8">Trainings You Are Instructing</h2>
            <TrainingsList
              trainings={instructing?.getTrainingsByInstructor || []}
              buttons={[
                {
                  label: "Edit",
                  onClick: (training: Training) => handleNavigation(training, "/trainings/edit", MainLayout),
                },
                {
                  label: "View",
                  onClick: (training: Training) => handleNavigation(training, "/trainings/details", MainLayout),
                },
              ]}
              text="You are currently not instructing any training."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;