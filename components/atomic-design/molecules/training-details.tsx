import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_TRAINING_BY_ID } from "@/graphql/frontend/trainings";
import TrainingMaterialsTable from "@/components/atomic-design/molecules/training-materials-table";
import AssessmentsTable from "@/components/atomic-design/molecules/assessments-table";
import { useSession } from "next-auth/react";
import { Assessment } from "@prisma/client";
import { useCallback } from "react";

export default function TrainingDetails() {
  const router = useRouter();
  const {data: session} = useSession();
  const { id } = router.query;

  const handleMetrics = useCallback((assessmentId: string) => { // Not yet implemented
    alert(`Metrics for assessment ID: ${assessmentId}`);
  }, []);

  const renderAction = useCallback(
    (assessment: Assessment) => (
      <button
        onClick={() => handleMetrics(assessment.id)}
        className="text-green-500 hover:text-green-700"
      >
        Metrics
      </button>
    ),
    [handleMetrics]
  );

  const { data, loading, error } = useQuery(GET_TRAINING_BY_ID, {
    variables: { trainingId: id },
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    skip: !id,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading training details: {error.message}</p>;

  const training = data?.getTrainingById;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{training?.title}</h1>
      <p className="mt-4">{training?.description}</p>
      <p className="mt-2">
        <strong>Instructor:</strong> {training?.instructor?.name || "N/A"}
      </p>
      <p className="mt-2">
        <strong>Visibility:</strong> {training?.isPublic ? "Public" : "Hidden"}
      </p>
      <p className="mt-2">
        <strong>Created At:</strong> {new Date(training?.createdAt).toLocaleString()}
      </p>

      {/* Training Materials */}
      <div className="mt-8">
        <TrainingMaterialsTable 
          trainingId={id as string}
        />
      </div>

      {/* Assessments */}
      <div className="mt-8">
        <AssessmentsTable 
          trainingId={id as string}
          renderAction={renderAction}
          canModifyAssessment={true}
        />
      </div>
    </div>
  );
}