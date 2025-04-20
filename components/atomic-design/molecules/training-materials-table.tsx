import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_TRAINING_MATERIAL,
  GET_TRAINING_MATERIALS,
  DELETE_TRAINING_MATERIAL,
} from "@/graphql/frontend/trainings";
import { useSession } from "next-auth/react";
import { PlusIcon } from "lucide-react";

interface TrainingMaterial {
  id: string;
  fileType: string;
  fileUrl: string;
  createdAt: string;
}

interface TrainingMaterialsTableProps {
  trainingId: string;
  canModifyMaterial: boolean;
}

export default function TrainingMaterialsTable({ trainingId, canModifyMaterial }: TrainingMaterialsTableProps) {
  const { data: session } = useSession();
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [fileType, setFileType] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const { data } = useQuery(GET_TRAINING_MATERIALS, {
    variables: { trainingId },
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
  });

  const [addTrainingMaterial, { loading: adding }] = useMutation(ADD_TRAINING_MATERIAL, {
    refetchQueries: ["GetTrainingMaterials"],
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
  });

  const [deleteTrainingMaterial] = useMutation(DELETE_TRAINING_MATERIAL, {
    refetchQueries: ["GetTrainingMaterials"],
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
  });

  const handleAddMaterial = async () => {
    if (!fileType || !fileUrl) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await addTrainingMaterial({
        variables: {
          trainingId,
          fileType,
          fileUrl,
        },
      });
      setShowAddMaterial(false);
      setFileType("");
      setFileUrl("");
      alert("Training material added successfully!");
    } catch (err) {
      console.error("Error adding training material:", err);
      alert("Failed to add training material.");
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      try {
        await deleteTrainingMaterial({
          variables: { id: materialId },
        });
        alert("Training material deleted successfully!");
      } catch (err) {
        console.error("Error deleting training material:", err);
        alert("Failed to delete training material.");
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Training Materials</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">File Type</th>
            <th className="border border-gray-300 px-4 py-2">File URL</th>
            {canModifyMaterial && (
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            )}
            {canModifyMaterial && (
            <th className="border border-gray-300 px-4 py-2">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data?.getTrainingMaterials?.map((material: TrainingMaterial) => (
            <tr key={material.id}>
              <td className="border border-gray-300 px-4 py-2">{material.fileType}</td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {material.fileUrl}
                </a>
              </td>
              {canModifyMaterial && (
              <td className="border border-gray-300 px-4 py-2">
                {new Date(material.createdAt).toLocaleString()}
              </td>
              )}
              <td className="border border-gray-300 px-4 py-2">
                {canModifyMaterial && (
                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {canModifyMaterial && (
      <>
        <button
          onClick={() => setShowAddMaterial(!showAddMaterial)}
          className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          {showAddMaterial ? "Close Form" : "Add Material"}
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            showAddMaterial ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Add Training Material</h3>
            <div className="mb-2">
              <label className="block text-sm font-medium">File Type:</label>
              <input
                type="text"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                placeholder="e.g., pdf, video"
                className="block w-full text-sm border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">File URL:</label>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="Enter file URL"
                className="block w-full text-sm border border-gray-300 rounded-lg p-2"
              />
            </div>
            <button
              onClick={handleAddMaterial}
              disabled={adding}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {adding ? "Submitting..." : "Add Material"}
            </button>
            <button
              onClick={() => setShowAddMaterial(false)}
              className="ml-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </>
      )}
    </div>
  );
}