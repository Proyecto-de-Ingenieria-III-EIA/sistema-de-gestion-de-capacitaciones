import UserProfileDetails from '@/components/atomic-design/molecules/user-profile/details';
import UserProfileHeader from '@/components/atomic-design/molecules/user-profile/header';
import UserProfileStats from '@/components/atomic-design/molecules/user-profile/stats';
import UserProfileTrainings from '@/components/atomic-design/molecules/user-profile/trainings';
import MainLayout from '@/components/layouts/main-layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <MainLayout>
      <div className='w-full max-w-7xl mx-auto p-6'>
        <Card>
          <div className='max-w-4xl mx-auto p-6'>
            <UserProfileHeader onEditClick={() => setIsEditing(!isEditing)} />
            <Separator />
            <UserProfileDetails
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
            <Separator />
            <UserProfileStats />
            <Separator />
            <UserProfileTrainings/>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
