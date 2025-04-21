import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_TRAINING_BY_ID } from "@/graphql/frontend/trainings";
import TrainingMaterialsTable from "@/components/atomic-design/molecules/training-materials-table";
import AssessmentsTable from "@/components/atomic-design/molecules/assessments-table";
import { useSession } from "next-auth/react";
import { GET_ASSESSMENT_PROGRESS_BY_TRAINING } from "@/graphql/frontend/users";
import MainLayout from "@/components/layouts/main-layout";

export default function TrainingDetailsForUser() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;

  const handleNavigateToForum = () => {
    router.push("/forum");
  }

  const { data, loading, error } = useQuery(GET_TRAINING_BY_ID, {
    variables: { trainingId: id },
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    skip: !id,
  });

  const {data: participantProgress} = useQuery(GET_ASSESSMENT_PROGRESS_BY_TRAINING, {
    variables: {
        userId: session?.user?.id,
        trainingId: id,
    },
    context: {
        headers: {
            "session-token": session?.sessionToken,
        },
    },
    skip: !id || !session?.user?.id,
    });

  const handleNavigateToCertificate = () => {
    if (progress?.progress === 100) {
      const trainingName = encodeURIComponent(training?.title || "Training");
      const userName = encodeURIComponent(session?.user?.name || "User");
      const certificateUrl = `/trainings/certificate?id=${id}&trainingName=${trainingName}&userName=${userName}`;
      window.open(certificateUrl, "_blank");
    }
    else {
      alert("You must complete the training before you can access the certificate.");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading training details: {error.message}</p>;

  const training = data?.getTrainingById;
  const progress = participantProgress?.getUserAssessmentProgressInTraining;

  console.log("Training Details:", training);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">{training?.title}</h1>
        <p className="mt-4">{training?.description}</p>
        <p className="mt-2">
          <strong>Instructor:</strong> {training?.instructor?.name || "N/A"}
        </p>
        <p className="mt-2">
          <strong>Progress:</strong> {progress?.progress || 0}%
        </p>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleNavigateToForum}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Forum
        </button>
        <button
          onClick={handleNavigateToCertificate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Certificate
        </button>
      </div>

        {/* Training Materials */}
        <div className="mt-8">
          <TrainingMaterialsTable trainingId={id as string} canModifyMaterial={false}/>
        </div>

        {/* Assessments */}
        <div className="mt-8">
          <AssessmentsTable trainingId={id as string} canModifyAssessment={false}/>
        </div>
      </div>
    </MainLayout>
  );
}