import React from 'react';
import { TrainingsList } from '@/components/atomic-design/organisms/trainings-list';
import { Training } from '@prisma/client';
import AdminLayout from '@/components/layouts/admin-layout';
import router from 'next/router';
import { useMutation } from '@apollo/client';
import {
  DELETE_TRAINING,
  DUPLICATE_TRAINING,
} from '@/graphql/frontend/trainings';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Delete } from 'lucide-react';

interface AdminDashboardProps {
  trainings: Training[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  trainings,
}) => {
  const { data: session } = useSession();
  const [deleteTrainingId, setDeleteTrainingId] = React.useState<string | null>(null);

  const [deleteTraining] = useMutation(DELETE_TRAINING, {
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
    refetchQueries: ['GetTrainings'],
  });

  const [duplicateTraining] = useMutation(DUPLICATE_TRAINING, {
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
    refetchQueries: ['GetTrainings'],
  });

  const handleDeleteTraining = async (trainingId: string) => {
    try {
      await deleteTraining({ variables: { id: trainingId } });
      toast('Training Deletion Success', {
        description: `The training has been deleted successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
      setDeleteTrainingId(null);
    } catch (err) {
      console.error('Error deleting training:', err);
      toast('Training Deletion Error', {
        description: `There was an error deleting the training: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handleDuplicateTraining = async (training: Training) => {
    try {
      await duplicateTraining({ variables: { trainingId: training.id } });
      toast('Training Duplication Successful', {
        description: `The training has been duplicated successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    } catch (err) {
      console.error('Error duplicating training:', err);
      toast('Training Duplication Error', {
        description: `There was an error duplicating the training: ${
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
    <div className='p-6'>
      {/* Header */}
      <AdminLayout>
        {/* Trainings List */}
        <TrainingsList
          trainings={trainings}
          buttons={[
            {
              label: 'Edit',
              onClick: (training: Training) => {
                localStorage.setItem(
                  'selectedTraining',
                  JSON.stringify(training)
                );
                router.push(`/trainings/edit?id=${training.id}`);
              },
            },
            {
              label: 'Delete',
              onClick: (training: Training) => {
                setDeleteTrainingId(training.id);
              },
            },
            {
              label: 'Duplicate',
              onClick: (training: Training) => {
                handleDuplicateTraining(training);
              },
            },
            {
              label: 'View',
              onClick: (training: Training) => {
                localStorage.setItem(
                  'selectedTraining',
                  JSON.stringify(training)
                );
                router.push(`/trainings/details?id=${training.id}`);
              },
            },
          ]}
        />

        {deleteTrainingId && (
          <AlertDialog open={!!deleteTrainingId} onOpenChange={(open) => {
            if (!open) setDeleteTrainingId(null);
          }}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the training permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteTrainingId(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteTraining(deleteTrainingId)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        )}
      </AdminLayout>
    </div>
  );
};
