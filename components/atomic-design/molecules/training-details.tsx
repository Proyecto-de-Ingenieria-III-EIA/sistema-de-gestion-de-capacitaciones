import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_TRAINING_BY_ID } from "@/graphql/frontend/trainings";
import TrainingMaterialsTable from "@/components/atomic-design/molecules/training-materials-table";
import AssessmentsTable from "@/components/atomic-design/molecules/assessments-table";
import { Assessment } from "@prisma/client";
import { useCallback } from "react";

interface TrainingDetailsProps {
  layout: string;
}

export default function TrainingDetails({layout}: TrainingDetailsProps) {
  const router = useRouter();
  const { id } = router.query;

  const handleNavigation = (assessment: Assessment, path: string) => {
    router.push({
      pathname: path,
      query: { 
        id: assessment.id,
        layout
      }, 
    });
  };

  const handleMetrics = useCallback((assessment: Assessment) => {
      return handleNavigation(assessment, "/assessments/metrics");
    }, [layout]);

  const renderAction = useCallback(
    (assessment: Assessment) => (
      <button
        onClick={() => handleMetrics(assessment)}
        className="text-green-500 hover:text-green-700"
      >
        Metrics
      </button>
    ),
    [handleMetrics]
  );

  const handleNavigateToForum = () => {
    router.push("/forum");
  }

  const handleNavigateToEdit = () => {
    router.push(`/trainings/edit?id=${id}`);
  }

  const { data, loading, error } = useQuery(GET_TRAINING_BY_ID, {
    variables: { trainingId: id },
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

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleNavigateToForum}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Forum
        </button>
        <button
          onClick={handleNavigateToEdit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Edit
        </button>
      </div>

      {/* Training Materials */}
      <div className="mt-8">
        <TrainingMaterialsTable 
          trainingId={id as string}
          canModifyMaterial={true}
        />
      </div>

      {/* Assessments */}
      <div className="mt-8">
        <AssessmentsTable 
          trainingId={id as string}
          renderAction={renderAction}
          canModifyAssessment={true}
          isHidden={training?.isHidden}
        />
      </div>
    </div>
  );
}