import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';

const MyEmployees = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [employeeCount, setEmployeeCount] = useState(0);

  const { data: employees = [], isLoading, refetch } = useQuery({
    queryKey: ['myEmployees'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/employers/myEmployees?companyEmail=${user.email}`);
      return data;
    },
  });

  const { mutateAsync: removeFromCompany } = useMutation({
    mutationFn: async (userId) => {
      const { data } = await axiosSecure.put(`/employers/removeFromCompany/${userId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Employee removed successfully.');
      setEmployeeCount((prevCount) => prevCount - 1);
      refetch();
    },
    onError: () => {
      toast.error('Failed to remove employee.');
    },
  });

  const handleRemoveFromCompany = (userId) => {
    removeFromCompany(userId);
  };

  useEffect(() => {
    setEmployeeCount(employees.length);
  }, [employees]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>My Employees</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <h1 className="text-xl font-semibold mb-4">My Employees</h1>
          <p className="mb-4">Employee Count: {employeeCount}</p>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
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
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      <img src={employee.imageUrl} alt={employee.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">{employee.name}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      {employee.isAdmin ? 'Admin' : 'Employee'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      <button
                        onClick={() => handleRemoveFromCompany(employee._id)}
                        className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyEmployees;
