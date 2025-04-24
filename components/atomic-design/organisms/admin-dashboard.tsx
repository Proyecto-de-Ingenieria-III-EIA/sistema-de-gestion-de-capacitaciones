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
} from '@radix-ui/react-alert-dialog';

interface AdminDashboardProps {
  trainings: Training[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  trainings,
}) => {
  const { data: session } = useSession();

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

  const handleDeleteTraining = async (training: Training) => {
    try {
      await deleteTraining({ variables: { id: training.id } });
      toast('Training Duplication Success', {
        description: `The training has been deleted successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    } catch (err) {
      console.error('Error deleting training:', err);
      toast('Training Deletion Error', {
        description: `There was an error deleting the training: ${err.message}`,
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
        description: `There was an error duplicating the training: ${err.message}`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const ConfirmDeleteTraining = ({ onConfirm }: { onConfirm: () => void }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className='w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100'>
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the training permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

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
              onClick: handleDeleteTraining,
            },
            {
              label: 'Delete',
              onClick: (training: Training) => {
                const confirmDelete = () => handleDeleteTraining(training);
                return <ConfirmDeleteTraining onConfirm={confirmDelete} />;
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
      </AdminLayout>
    </div>
  );
};
