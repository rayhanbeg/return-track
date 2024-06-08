import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { Document, Page, Text, PDFDownloadLink } from '@react-pdf/renderer';

const MyAssets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['userRequests', user?.email, search, status, type],
    queryFn: async () => {
      if (!user?.email) return [];
      console.log('Fetching data with:', { email: user?.email, search, status, type });
      const { data } = await axiosSecure.get(`/requests/filter?email=${user?.email}&search=${search}&status=${status}&type=${type}`);
      console.log('Fetched data:', data);
      return data;
    },
    enabled: !!user?.email,
  });
  console.log(requests);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  useEffect(() => {
    if (user?.email) {
      refetch();
    }
  }, [search, status, type, refetch, user?.email]);

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);

  const { mutateAsync: cancelRequest } = useMutation({
    mutationFn: async (requestId) => {
      const { data } = await axiosSecure.delete(`/cancelRequest/${requestId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Request canceled successfully.');
      refetch();
    },
    onError: () => {
      toast.error('Failed to cancel request.');
    },
  });

  const { mutateAsync: returnAsset } = useMutation({
    mutationFn: async (requestId) => {
      try {
        const { data } = await axiosSecure.put(`/returnAsset/${requestId}`);
        if (data && data.assetUpdated) {
          toast.success('Asset returned successfully.');
          refetch();
        } else {
          toast.error('Failed to return asset.');
          
        }
      } catch (error) {
        toast.error('Failed to return asset.');
        console.log(error);
      }
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const PrintDocument = ({ asset }) => (
    <Document>
      <Page style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>ReturnTrack</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 10 }}>Asset Information</Text>
        <Text>Asset Name: {asset?.name}</Text>
        <Text>Asset Type: {asset?.type}</Text>
        <Text>Request Date: {asset?.requestDate}</Text>
        <Text>Approval Date: {asset?.approvalDate ? new Date(asset?.approvalDate).toLocaleDateString() : 'N/A'}</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 20 }}>Printed on: {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );

  if (!user?.email) {
    return <div>Loading user information...</div>;
  }

  return (
    <>
      <Helmet>
        <title>My Assets</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="flex flex-wrap items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchInput}
              onChange={handleSearchChange}
              className="flex-grow border p-2 rounded w-full sm:w-auto text-sm sm:text-base"
            />
            <select
              value={status}
              onChange={handleStatusChange}
              className="flex-grow border p-2 rounded w-full sm:w-auto text-sm sm:text-base"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
            <select
              value={type}
              onChange={handleTypeChange}
              className="flex-grow border p-2 rounded w-full sm:w-auto text-sm sm:text-base"
            >
              <option value="">All Types</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-Returnable</option>
            </select>
          </div>

          {requests?.length > 0 ? (
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                        Asset Name
                      </th>
                      <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                        Asset Type
                      </th>
                      <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                        Request Date
                      </th>
                      <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                        Approval Date
                      </th>
                      <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                        Request Status
                      </th>
                      <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests?.map((request) => (
                      <tr key={request?._id}>
                        <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">{request?.name}</td>
                        <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">{request?.type}</td>
                        <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">{new Date(request?.requestDate).toLocaleDateString()}</td>
                        <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">{request?.approvalDate ? new Date(request?.approvalDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">{request?.status}</td>
                        <td className="px-5 py-5 border-b border-gray-200 text-xs sm:text-sm">
                          {request?.status === 'Pending' && (
                            <button
                              onClick={() => cancelRequest(request?._id)}
                              className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                            >
                              Cancel
                            </button>
                          )}
                          {request?.status === 'Approved' && (
                            <>
                              <PDFDownloadLink
                                document={<PrintDocument asset={request} />}
                                fileName="asset_details.pdf"
                              >
                                {({ loading }) => (
                                  <button className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm">
                                    {loading ? 'Loading document...' : 'Print'}
                                  </button>
                                )}
                              </PDFDownloadLink>
                              {request?.status === 'Approved' && request?.type === 'Returnable' && (
                                <button
                                  onClick={() => returnAsset(request._id)}
                                  disabled={request?.status === 'Returned'}
                                  className="text-green-600 hover:text-green-900 ml-4 disabled:opacity-50 text-xs sm:text-sm"
                                >
                                  Return
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h1 className="text-gray-600 text-xs sm:text-base">No requests found.</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAssets;
