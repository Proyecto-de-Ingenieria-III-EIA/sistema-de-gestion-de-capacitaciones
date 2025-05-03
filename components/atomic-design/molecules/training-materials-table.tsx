import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  ADD_TRAINING_MATERIAL,
  GET_TRAINING_MATERIALS,
  DELETE_TRAINING_MATERIAL,
} from '@/graphql/frontend/trainings';
import { useSession } from 'next-auth/react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogOverlay,
} from '@/components/ui/alert-dialog';

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

export default function TrainingMaterialsTable({
  trainingId,
  canModifyMaterial,
}: TrainingMaterialsTableProps) {
  const { data: session } = useSession();
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [fileType, setFileType] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null
  );

  const { data } = useQuery(GET_TRAINING_MATERIALS, {
    variables: { trainingId },
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
  });

  const [addTrainingMaterial, { loading: adding }] = useMutation(
    ADD_TRAINING_MATERIAL,
    {
      refetchQueries: ['GetTrainingMaterials'],
      context: {
        headers: {
          'session-token': session?.sessionToken,
        },
      },
    }
  );

  const [deleteTrainingMaterial] = useMutation(DELETE_TRAINING_MATERIAL, {
    refetchQueries: ['GetTrainingMaterials'],
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
  });

  const handleAddMaterial = async () => {
    if (!fileType || !fileUrl) {
      toast.error('Missing Fields', {
        description: `Please fill in all fields.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
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
      setFileType('');
      setFileUrl('');
      toast.success('Training Material Added', {
        description: `The training material has been added successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    } catch (err) {
      console.error('Error adding training material:', err);
      toast.error('Training Material Addition Error', {
        description: `There was an error adding the training material: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      await deleteTrainingMaterial({
        variables: { id: materialId },
      });
      toast.success('Training Material Deletion Success', {
        description: `The training material has been deleted successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    } catch (err) {
      console.error('Error deleting training material:', err);
      toast.error('Training Material Deletion Error', {
        description: `There was an error deleting the training material: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-semibold mb-4'>Training Materials</h2>
      <table className='min-w-full border border-gray-300'>
        <thead>
          <tr className='border-b border-gray-300'>
            <th className='px-4 py-2'>File Type</th>
            <th className='px-4 py-2'>File URL</th>
            {canModifyMaterial && <th className='px-4 py-2'>Created At</th>}
            {canModifyMaterial && <th className='px-4 py-2 '>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data?.getTrainingMaterials?.map((material: TrainingMaterial) => (
            <tr key={material.id}>
              <td className='px-4 py-2'>{material.fileType}</td>
              <td className='px-4 py-2'>
                <a
                  href={material.fileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  {material.fileUrl}
                </a>
              </td>
              {canModifyMaterial && (
                <td className='px-4 py-2'>
                  {new Date(material.createdAt).toLocaleString()}
                </td>
              )}
              {canModifyMaterial && (
                <td className='px-4 py-2 flex items-center justify-center'>
                  <button
                    className='text-red-500 hover:text-red-700'
                    onClick={() => {
                      setSelectedMaterialId(material.id);
                      setDialogOpen(true);
                    }}
                  >
                    <TrashIcon className='w-5 h-5 flex items-center' />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {canModifyMaterial && (
        <>
          <button
            onClick={() => setShowAddMaterial(!showAddMaterial)}
            className='mt-4 flex items-center text-blue-500 hover:text-blue-700'
          >
            <PlusIcon className='w-5 h-5 mr-2' />
            {showAddMaterial ? 'Close Form' : 'Add Material'}
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              showAddMaterial ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className='mt-4'>
              <h3 className='text-lg font-semibold mb-2'>
                Add Training Material
              </h3>
              <div className='mb-2'>
                <label className='block text-sm font-medium'>File Type:</label>
                <input
                  type='text'
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  placeholder='e.g., pdf, video'
                  className='block w-full text-sm border border-gray-300 rounded-lg p-2'
                />
              </div>
              <div className='mb-2'>
                <label className='block text-sm font-medium'>File URL:</label>
                <input
                  type='text'
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder='Enter file URL'
                  className='block w-full text-sm border border-gray-300 rounded-lg p-2'
                />
              </div>
              <button
                onClick={handleAddMaterial}
                disabled={adding}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
              >
                {adding ? 'Submitting...' : 'Add Material'}
              </button>
              <button
                onClick={() => setShowAddMaterial(false)}
                className='ml-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400'
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* AlertDialog as a centered pop-up */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The material will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDialogOpen(false)}
              className='px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedMaterialId)
                  handleDeleteMaterial(selectedMaterialId);
                setDialogOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
