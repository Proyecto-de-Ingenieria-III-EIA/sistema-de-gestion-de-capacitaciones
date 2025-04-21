import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Certificate() {
  const router = useRouter();
  const { trainingName } = router.query; 
  const { data: session } = useSession();

  const userName = session?.user?.name || "User"; 
  const dateCompleted = new Date().toLocaleDateString();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl text-center border border-gray-300">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Course Completion Certificate
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          This is to certify that
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {userName}
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          has successfully completed 100% of the training
        </p>
        <h3 className="text-xl font-medium text-gray-800 mb-6">
          {trainingName || "Training Name"}
        </h3>
        <p className="text-lg text-gray-700">
          Date of Completion: <span className="font-semibold">{dateCompleted}</span>
        </p>
      </div>
    </div>
  );
}