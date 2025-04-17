import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_TRAINING_BY_ID } from "@/graphql/frontend/trainings";
import TrainingMaterialsTable from "@/components/atomic-design/molecules/training-materials-table";
import AssessmentsTable from "@/components/atomic-design/molecules/assessments-table";
import { useSession } from "next-auth/react";
import { Assessment } from "@prisma/client";
import { useCallback } from "react";
import { GET_ASSESSMENT_RESULTS_BY_USER } from "@/graphql/frontend/assessments";
import { GET_ASSESSMENT_PROGRESS_BY_TRAINING } from "@/graphql/frontend/users";
import MainLayout from "@/components/layouts/main-layout";

export default function TrainingDetailsForUser() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_TRAINING_BY_ID, {
    variables: { trainingId: id },
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    skip: !id,
  });

  const { data: resultsData } = useQuery(GET_ASSESSMENT_RESULTS_BY_USER, {
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

  const renderAction = useCallback(
    (assessment: Assessment) => {
      const result = resultsData?.getAssessmentResultsByUser.find((res: { assessment: { id: string; }; }) => res.assessment.id === assessment.id);
      const userScore = (result && result?.score) ?? 0;
      return <span className="text-gray-700">Score: {userScore}%</span>;
    },
    [resultsData?.getAssessmentResultsByUser]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading training details: {error.message}</p>;

  const training = data?.getTrainingById;
  const progress = participantProgress?.getUserAssessmentProgressInTraining;

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

        {/* Training Materials */}
        <div className="mt-8">
          <TrainingMaterialsTable trainingId={id as string} />
        </div>

        {/* Assessments */}
        <div className="mt-8">
          <AssessmentsTable trainingId={id as string} renderAction={renderAction} canModifyAssessment={false}/>
        </div>
      </div>
    </MainLayout>
  );
}