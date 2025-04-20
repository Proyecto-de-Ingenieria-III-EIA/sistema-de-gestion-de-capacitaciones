import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_ASSESSMENT_METRICS, GET_ASSESSMENT_RESULTS } from "@/graphql/frontend/assessments";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function MetricsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_ASSESSMENT_METRICS, {
    variables: { assessmentId: id },
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    skip: !id,
  });

  const { data: userResults} = useQuery(GET_ASSESSMENT_RESULTS, {
    variables: { assessmentId: id },
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    skip: !id,
  })

  if (loading) return <p>Loading metrics...</p>;
  if (error) return <p>Error loading metrics: {error.message}</p>;

  const metrics = data?.getAssessmentMetrics;
  const users = userResults?.getAssessmentResults;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assessment Metrics</h1>
  
      {/* Metrics Summary */}
      <div className="mb-6">
        <p><strong>Mean Score:</strong> {metrics?.meanScore}%</p>
        <p><strong>Max Score:</strong> {metrics?.maxScore}%</p>
        <p><strong>Min Score:</strong> {metrics?.minScore}%</p>
      </div>
  
      {/* Users Table */}
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      {users && users.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((result: any) => (
              <tr key={result.id}>
                <td className="border border-gray-300 px-4 py-2">{result.user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{result.user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{result.score}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No users have taken the assessment.</p>
      )}
    </div>
  );
}