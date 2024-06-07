import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';

const RequestList = () => {
  const axiosSecure = useAxiosSecure();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['allRequests'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/allRequests`);
      return data;
    },
  });

  const { mutateAsync: approveRequest } = useMutation({
    mutationFn: async (requestId) => {
      const { data } = await axiosSecure.put(`/approveRequest/${requestId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Request approved successfully.');
      refetch();
    },
    onError: () => {
      toast.error('Failed to approve request.');
    },
  });

  const { mutateAsync: rejectRequest } = useMutation({
    mutationFn: async (requestId, approvalDate) => {
      const { data } = await axiosSecure.put(`/rejectRequest/${requestId}`, {approvalDate});
      return data;
    },
    onSuccess: () => {
      toast.success('Request rejected successfully.');
      refetch();
    },
    onError: () => {
      toast.error('Failed to reject request.');
    },
  });

  const handleApprove = async (requestId) => {
    try {
      const approvalDate = new Date().toLocaleDateString();
      await approveRequest(requestId, approvalDate);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId);
    } catch (error) {
      console.log(error);
    }
  };
console.log(requests);
  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Request List</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Asset Name</th>
                    <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Asset Type</th>
                    <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Email of requester</th>
                    <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Name of requester</th>
                    <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Request Date</th>
                    <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Additional note</th>
                    <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Status</th>
                    <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td className="px-5 py-5 border-b border-gray-200">{request.name}</td>
                      <td className="px-5 py-5 border-b border-gray-200">{request.type}</td>
                      <td className="px-5 py-5 border-b border-gray-200">{request.requestedBy}</td>
                      <td className="px-5 py-5 border-b border-gray-200">{request.requestedByName}</td>
                      <td className="px-5 py-5 border-b border-gray-200">{new Date(request.requestDate).toLocaleDateString()}</td>
                      <td className="px-5 py-5 border-b border-gray-200">{request.notes}</td>
                      <td className="px-5 py-5 border-b border-gray-200">{request.status}</td>
                      <td className="px-5 py-5 border-b border-gray-200">
                        {request.status === 'Pending' && (
                          <>
                            <button onClick={() => handleApprove(request._id)} className="text-green-600 hover:text-green-900">Approve</button>
                            <button onClick={() => handleReject(request._id)} className="text-red-600 hover:text-red-900 ml-2">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestList;
