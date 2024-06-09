import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';

const AddEmployee = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedMembers, setSelectedMembers] = useState([]);

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['unaffiliatedEmployers'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/employers/unaffiliated');
      return data;
    },
  });

  const { mutateAsync: addToTeamMutation } = useMutation({
    mutationFn: async ({ userIds, companyEmail }) => {
      const { data } = await axiosSecure.put('/employers/addToTeam', { userIds, companyEmail });
      return data;
    },
    onSuccess: () => {
      toast.success('Members added to the team successfully.');
      setSelectedMembers([]); // Clear selected members
      refetch();
    },
    onError: () => {
      toast.error('Failed to add members to the team.');
    },
  });

  const handleSelectMember = (userId) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleAddSelectedMembers = () => {
    addToTeamMutation({ userIds: selectedMembers, companyEmail: user.email });
  };

  const handleAddToTeam = (userId) => {
    addToTeamMutation({ userIds: [userId], companyEmail: user.email });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Add Employees</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <h1 className="text-xl font-semibold mb-4">Add Employees to Team</h1>
          <p className="mb-4">Unaffiliated Employee: {users?.length}</p>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                    Select
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                    Image
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                    Name
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                    Member Type
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id}>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user._id)}
                        onChange={() => handleSelectMember(user._id)}
                      />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">{user.name}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      {user.isAdmin ? 'Admin' : 'Employee'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      <button
                        onClick={() => handleAddToTeam(user._id)}
                        className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm"
                      >
                        Add to Team
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedMembers.length > 0 && (
            <div className="mt-4">
              <button
                onClick={handleAddSelectedMembers}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Selected Members to Team
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddEmployee;
