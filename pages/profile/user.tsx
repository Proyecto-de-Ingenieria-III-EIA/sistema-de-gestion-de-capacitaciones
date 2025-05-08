import AdminLayout from '@/components/layouts/admin-layout';
import {
  GET_PROGRESS_IN_TRAININGS,
  GET_USER_PROFILE,
} from '@/graphql/frontend/users';
import { useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layouts/main-layout';

const layouts = {
  AdminLayout,
  MainLayout
};

export default function UserDetails() {
  const router = useRouter();
  const { id, layout } = router.query;
  const { data: session } = useSession();

  const Layout = layouts[layout as keyof typeof layouts] || MainLayout;

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_PROFILE, {
    variables: { id: id },
    skip: !id,
  });

  const {
    data: progressData,
    loading: progressLoading,
    error: progressError,
  } = useQuery(GET_PROGRESS_IN_TRAININGS, {
    variables: { userId: id },
    skip: !id,
  });

  const handleNavigateToCertificate = (training: any) => {
    if (training.progress === 100) {
      const trainingName = encodeURIComponent(training?.trainingTitle || 'Training');
      const userName = encodeURIComponent(session?.user?.name || 'User');
      const certificateUrl = `/trainings/certificate?id=${id}&trainingName=${trainingName}&userName=${userName}`;
      window.open(certificateUrl, '_blank');
    } else {
      toast.info(
        'You must complete the training before you can access the certificate.'
      );
    }
  };

  if (userLoading || progressLoading) return <p>Loading profile...</p>;
  if (userError) return <p>Error loading profile: {userError.message}</p>;
  if (progressError)
    return <p>Error loading training progress: {progressError.message}</p>;

  const user = userData?.getUserById;
  const trainingProgress = progressData?.getUserProgressForTrainings || [];

  return (
    <Layout>
      <div className='max-w-4xl mx-auto mt-8 p-4'>
        <h1 className='text-2xl font-bold mb-6'>My Profile</h1>
        <div className='bg-white shadow-md rounded p-6'>
          <h2 className='text-xl font-semibold mb-4'>Profile Details</h2>
          <div className='mb-4'>
            <strong>Name:</strong> {user.name}
          </div>
          <div className='mb-4'>
            <strong>Email:</strong> {user.email}
          </div>
          <div className='mb-4'>
            <strong>Area:</strong> {user.area || 'Not specified'}
          </div>
          <div className='mb-4'>
            <strong>Phone:</strong> {user.phone || 'Not specified'}
          </div>
          <div className='mb-4'>
            <strong>Role:</strong>{' '}
            {user.role?.name === 'USER'
              ? 'User'
              : user.role?.name === 'ADMIN'
                ? 'Administrator'
                : user.role?.name === 'INSTRUCTOR'
                  ? 'Instructor'
                  : 'Unknown'}{' '}
          </div>
          <div className='mb-4'>
            <strong>Date Joined:</strong>{' '}
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
          <div className='mb-4'>
            <strong>Last Update:</strong>{' '}
            {new Date(user.updatedAt).toLocaleDateString()}
          </div>
          <button
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            onClick={() =>
              toast('Edit Button Clicked', {
                description: `Add functionality to edit user details.`,
                action: {
                  label: 'Dismiss',
                  onClick: () => toast.dismiss(),
                },
              })
            }
          >
            Edit User
          </button>
        </div>

        <h2 className='text-xl font-semibold mt-8 mb-4'>Trainings</h2>
        <div className='space-y-4'>
          {trainingProgress.length === 0 ? (
            <p className='text-gray-500'>User not enrolled in any trainings</p>
          ) : (
            trainingProgress.map((training: any) => (
              <div
                key={training.trainingId}
                className='border p-4 rounded shadow-sm'
              >
                <h3 className='text-lg font-semibold'>
                  {training.trainingTitle}
                </h3>
                <p>Progress: {training.progress}%</p>
                {training.progress === 100 && (
                  <button
                    className='mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
                    onClick={() => handleNavigateToCertificate(training)}
                  >
                    Download Certificate
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
