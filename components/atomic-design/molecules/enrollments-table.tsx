import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { DELETE_ENROLLMENT, GET_AVAILABLE_USERS_FOR_TRAINING } from "@/graphql/frontend/enrollments";
import { SUBSCRIBE_TO_TRAINING_ADMIN } from "@/graphql/frontend/enrollments";
import { PlusIcon } from "lucide-react";
import { Participant } from "@/types/participant";
import { useSession } from "next-auth/react";
import { Combobox } from "@/components/ui/combobox";

interface EnrollmentsTableProps {
  trainingId: string;
  participants: Participant[];
}

export default function EnrollmentsTable({
  trainingId,
  participants,
}: EnrollmentsTableProps) {
    const { data: session } = useSession();
    const [showAddParticipant, setShowAddParticipant] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Participant | null>(null);

  const { data, loading, error } = useQuery(GET_AVAILABLE_USERS_FOR_TRAINING, {
    variables: { trainingId },
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
    skip: !showAddParticipant, 
  });

  const [subscribeToTraining] = useMutation(SUBSCRIBE_TO_TRAINING_ADMIN, {
    refetchQueries: ["GetEnrollmentsByTraining"], 
    context: {
        headers: {
            "session-token": session?.sessionToken,
        },
    }
  });

  const handleAddParticipant = async () => {
    if (!selectedUser) return;

    try {
      await subscribeToTraining({
        variables: { trainingId, userId: selectedUser.id },
      });
      setShowAddParticipant(false);
      setSelectedUser(null);
      alert("Participant added successfully!");
    } catch (err) {
      console.error("Error adding participant:", err);
    }
  };

  const [deleteEnrollment] = useMutation(DELETE_ENROLLMENT, {
    refetchQueries: ["GetEnrollmentsByTraining"], 
    context: {
        headers: {
            "session-token": session?.sessionToken,
        },
    }
  });

  const handleDeleteParticipant = async (enrollmentId: string) => {
    try {
      await deleteEnrollment({ variables: { id: enrollmentId } });
      alert("Participant removed successfully!");
    } catch (err) {
      console.error("Error removing participant:", err);
      alert("Failed to remove participant.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Participants</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Area</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td className="border border-gray-300 px-4 py-2">{participant.user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{participant.user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{participant.user.area}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDeleteParticipant(participant.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => setShowAddParticipant(true)}
        className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Participant
      </button>

      {showAddParticipant && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Select a User</h3>
          {loading && <p>Loading...</p>}
          {error && <p>Error loading users: {error.message}</p>}
          {data && (
            <Combobox
            items={data.getAvailableUsersForTraining.map((user: any) => ({
              value: user.id,
              label: `${user.name} (${user.email})`,
              data: user, 
            }))}
            placeholder="Select a user"
            onSelect={(item) => setSelectedUser(item.data)} 
          />
          )}
          <button
            onClick={handleAddParticipant}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}