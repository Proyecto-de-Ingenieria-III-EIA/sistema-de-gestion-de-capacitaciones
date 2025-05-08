import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS, UPDATE_USERS } from '@/graphql/frontend/users';
import { useState } from 'react';
import AdminLayout from '@/components/layouts/admin-layout';
import { roleMapping } from '@/types/roles';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { User } from '@prisma/client';

export default function AdminUsers() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USERS);

  const [isEditing, setIsEditing] = useState(false);
  const [editableUsers, setEditableUsers] = useState<any[]>([]);

  const [updateUsers] = useMutation(UPDATE_USERS, {
    refetchQueries: [
      {
        query: GET_USERS,
      },
    ],
  });

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  const users = data?.getUsers;

  const handleEdit = () => {
    setIsEditing(true);
    setEditableUsers(users.map((user: any) => ({ ...user })));
  };

  const handleSave = async () => {
    try {
      const updatedUsers = editableUsers.map((user) => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        area: user.area,
        roleId: parseInt(user.role.id, 10),
      }));

      const response = await updateUsers({
        variables: { users: updatedUsers },
      });

      setIsEditing(false);
      setEditableUsers([]);
      toast.success('Changes Saved', {
        description: `Your changes have been saved successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Changes Not Saved', {
        description: `There was an error saving your changes. Please try again.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableUsers([]);
    toast.info('Changes canceled', {
      description: `The changes you made have been discarded.`,
      action: {
        label: 'Dismiss',
        onClick: () => toast.dismiss(),
      },
    });
  };

  const handleFieldChange = (
    id: string,
    field: string,
    value: string | { name: string }
  ) => {
    setEditableUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              [field]:
                field === 'role' && typeof value === 'string'
                  ? {
                      name: value,
                      id: roleMapping[value as keyof typeof roleMapping],
                    }
                  : value,
            }
          : user
      )
    );
  };

  const handleNavigation = (user: User, path: string, Layout: React.FC<{ children: React.ReactNode }>) => {
    router.push({
      pathname: path,
      query: { 
        id: user.id,
        layout: Layout.name 
      }, 
    });
  };

  return (
    <AdminLayout>
      <div className='max-w-6xl mx-auto mt-8 p-4'>
        <h1 className='text-2xl font-bold mb-6'>Manage Users</h1>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='px-4 py-2 border'>Name</th>
                <th className='px-4 py-2 border'>Area</th>
                <th className='px-4 py-2 border'>Role</th>
                <th className='px-4 py-2 border'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(isEditing ? editableUsers : users)?.length > 0 ? (
                (isEditing ? editableUsers : users).map((user: any) => (
                  <tr key={user.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-2 border'>
                      {isEditing ? (
                        <input
                          type='text'
                          value={user.name}
                          onChange={(e) =>
                            handleFieldChange(user.id, 'name', e.target.value)
                          }
                          className='border border-gray-300 rounded p-1 w-full'
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className='px-4 py-2 border'>
                      {isEditing ? (
                        <select
                          value={user.area}
                          onChange={(e) =>
                            handleFieldChange(user.id, 'area', e.target.value)
                          }
                          className='border border-gray-300 rounded p-1 w-full'
                        >
                          <option value='Human Resources'>
                            Human Resources
                          </option>
                          <option value='Finance'>Finance</option>
                          <option value='Development'>Development</option>
                          <option value='Maintenance'>Maintenance</option>
                          <option value='Administrative'>Administrative</option>
                          <option value='Teaching'>Teaching</option>
                          <option value='Engineering'>Engineering</option>
                        </select>
                      ) : (
                        user.area
                      )}
                    </td>
                    <td className='px-4 py-2 border'>
                      {isEditing ? (
                        <select
                          value={user.role?.name || ''}
                          onChange={(e) =>
                            handleFieldChange(user.id, 'role', e.target.value)
                          }
                          className='border border-gray-300 rounded p-1 w-full'
                        >
                          <option value=''>Select Role</option>
                          <option value='INSTRUCTOR'>Instructor</option>
                          <option value='USER'>User</option>
                          <option value='ADMIN'>Administrator</option>
                        </select>
                      ) : user.role?.name === 'INSTRUCTOR' ? (
                        'Instructor'
                      ) : user.role?.name === 'USER' ? (
                        'User'
                      ) : user.role?.name === 'ADMIN' ? (
                        'Administrator'
                      ) : (
                        'Unknown'
                      )}
                    </td>
                    <td className='px-4 py-2 border'>
                      <button
                        onClick={() =>
                          handleNavigation(user, '/profile/user', AdminLayout)
                        }
                        className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2'
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='text-center py-4'>
                    No users available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <div className='mt-4 flex justify-end space-x-4'>
            <button
              onClick={handleSave}
              className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
            >
              Cancel
            </button>
          </div>
        )}
        {!isEditing && (
          <div className='mt-4 flex justify-end'>
            <button
              onClick={handleEdit}
              className='px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600'
            >
              Edit All
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
