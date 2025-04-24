import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  DELETE_ENROLLMENT,
  GET_AVAILABLE_USERS_FOR_TRAINING,
  GET_ENROLLMENTS,
} from '@/graphql/frontend/enrollments';
import { SUBSCRIBE_TO_TRAINING_ADMIN } from '@/graphql/frontend/enrollments';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Participant } from '@/types/participant';
import { useSession } from 'next-auth/react';
import { Combobox } from '@/components/ui/combobox';
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
} from '@/components/ui/alert-dialog';

interface EnrollmentsTableProps {
  trainingId: string;
}

export default function EnrollmentsTable({
  trainingId,
}: EnrollmentsTableProps) {
  const { data: session } = useSession();
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[] | null>([]);

  const { data, loading, error } = useQuery(GET_AVAILABLE_USERS_FOR_TRAINING, {
    variables: { trainingId },
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
    skip: !showAddParticipant,
  });

  const { data: enrollmentsData } = useQuery(GET_ENROLLMENTS, {
    variables: {
      trainingId: trainingId,
    },
    skip: !trainingId,
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
  });

  useEffect(() => {
    if (enrollmentsData) {
      setParticipants(enrollmentsData.getEnrollmentsByTraining);
    }
  }, [enrollmentsData]);

  const [subscribeToTraining] = useMutation(SUBSCRIBE_TO_TRAINING_ADMIN, {
    refetchQueries: ['GetEnrollmentsByTraining'],
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
  });

  const handleAddParticipant = async () => {
    if (!selectedUser) return;

    try {
      await subscribeToTraining({
        variables: { trainingId, userId: selectedUser.id },
      });
      setShowAddParticipant(false);
      setSelectedUser(null);
      toast('Participant Added', {
        description: `The participant has been added successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    } catch (err) {
      console.error('Error adding participant:', err);
      toast('Error Adding Participant', {
        description: `There was an error adding the participant: ${err.message}`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const [deleteEnrollment] = useMutation(DELETE_ENROLLMENT, {
    refetchQueries: ['GetEnrollmentsByTraining'],
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
  });

  const handleDeleteParticipant = async (enrollmentId: string) => {
    try {
      await deleteEnrollment({ variables: { id: enrollmentId } });
      toast('Participant Removed Successfully', {
        description: `The participant has been removed successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    } catch (err) {
      console.error('Error removing participant:', err);
      toast('Participant Deletion Error', {
        description: `There was an error removing the participant: ${err.message}`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-semibold mb-4'>Participants</h2>
      <table className='min-w-full border border-gray-300'>
        <thead>
          <tr className='border-b border-gray-300'>
            <th className='px-4 py-2'>Name</th>
            <th className='px-4 py-2'>Email</th>
            <th className='px-4 py-2'>Area</th>
            <th className='px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants &&
            participants.map((participant) => (
              <tr key={participant.id} className='border-b border-gray-300'>
                <td className='px-4 py-2'>{participant.user.name}</td>
                <td className='px-4 py-2'>{participant.user.email}</td>
                <td className='px-4 py-2'>{participant.user.area}</td>
                <td className='px-4 py-2 flex items-center justify-center'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className='text-red-500 hover:text-red-700'>
                        <TrashIcon className='w-5 h-5' />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-white'>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The assessment will be
                          permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDeleteParticipant(participant.id)
                          }
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button
        onClick={() => setShowAddParticipant(true)}
        className='mt-4 flex items-center text-blue-500 hover:text-blue-700'
      >
        <PlusIcon className='w-5 h-5 mr-2' />
        Add Participant
      </button>

      {showAddParticipant && (
        <div className='mt-4'>
          <h3 className='text-lg font-semibold mb-2'>Select a User</h3>
          {loading && <p>Loading...</p>}
          {error && <p>Error loading users: {error.message}</p>}
          {data && (
            <Combobox
              items={data.getAvailableUsersForTraining.map((user: any) => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
                data: user,
              }))}
              placeholder='Select a user'
              onSelect={(item) => setSelectedUser(item.data)}
            />
          )}
          <button
            onClick={handleAddParticipant}
            className='ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
