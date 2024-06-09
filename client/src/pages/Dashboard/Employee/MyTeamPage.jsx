import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';

const MyTeamPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axiosSecure.get(`/employers/teamMembers/${user.email}`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [axiosSecure, user.email]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>My Team</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <h1 className="text-xl font-semibold mb-4">My Team</h1>
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
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member._id}>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      <img src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">{member.name}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                      {member.isAdmin ? 'Admin' : 'Employee'}
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

export default MyTeamPage;
