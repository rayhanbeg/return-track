import { useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import RequestModal from "../../../components/Modal/RequestModal";

const AssetsList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Fetch Assets Data
  const { data: assets = [], isLoading, refetch } = useQuery({
    queryKey: ['assets', search, availabilityFilter, typeFilter],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/filtered-assets?search=${search}&availability=${availabilityFilter}&type=${typeFilter}`);
      return data;
    },
  });
  console.log(assets);

  // Mutation to handle asset requests
  const { mutateAsync: requestAsset } = useMutation({
    mutationFn: async ({ assetId, notes, name, type }) => {
      const requestData = {
        assetId,
        name,
        type,
        notes,
        requestDate: new Date().toISOString(),
        requestedBy: user.email,
        requestedByName: user.displayName,
      };
      const { data } = await axiosSecure.put('/requestAsset', requestData);
      return data;
    },
    onSuccess: () => {
      toast.success('Asset requested successfully.');
      refetch();
    },
    onError: (error) => {
      console.log('Request failed:', error.response ? error.response.data : error.message);
      toast.error('Failed to request asset.');
    },
  });

  // Handle request button click
  const handleRequest = async (assetId, notes, name, type, requestedByName) => {
    try {
      await requestAsset({ assetId, notes, name, type, requestedByName });
      setSelectedAsset(null); // Close modal after request
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Assets List</title>
      </Helmet>

      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          <div className='mb-4 flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-4'>
            <input
              type='text'
              placeholder='Search by name'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='flex-grow border p-2 rounded w-full sm:w-auto text-sm sm:text-base'
            />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className='flex-grow border p-2 rounded w-full sm:w-auto text-sm sm:text-base'
            >
              <option value=''>All Availability</option>
              <option value='Available'>Available</option>
              <option value='Out of stock'>Out of stock</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className='flex-grow border p-2 rounded w-full sm:w-auto text-sm sm:text-base'
            >
              <option value=''>All Types</option>
              <option value='Returnable'>Returnable</option>
              <option value='Non-returnable'>Non-returnable</option>
            </select>
          </div>

          {assets.length > 0 ? (
            <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
              <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                <table className='min-w-full leading-normal'>
                  <thead>
                    <tr>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal'
                      >
                        Asset Name
                      </th>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal'
                      >
                        Asset Type
                      </th>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal'
                      >
                        Availability
                      </th>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-xs sm:text-sm uppercase font-normal'
                      >
                        Request
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset._id}>
                        <td className='px-5 py-5 border-b border-gray-200 text-xs sm:text-sm'>
                          <p className='text-gray-900 whitespace-no-wrap'>{asset.name}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 text-xs sm:text-sm'>
                          <p className='text-gray-900 whitespace-no-wrap'>{asset.type}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 text-xs sm:text-sm'>
                          <p className='text-gray-900 whitespace-no-wrap'>
                            {asset.quantity === 0 ? 'Out of stock' : 'Available'}
                          </p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 text-xs sm:text-sm'>
                          <button
                            onClick={() => setSelectedAsset(asset)}
                            disabled={asset.quantity === 0}
                            className='text-indigo-600 hover:text-indigo-900 disabled:opacity-50'
                          >
                            Request
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className='text-center py-8'>
              <h1 className='text-gray-600 text-xs sm:text-base'>No assets found.</h1>
            </div>
          )}
        </div>
      </div>

      {selectedAsset && (
        <RequestModal
          asset={selectedAsset}
          onRequest={(assetId, notes) => handleRequest(assetId, notes, selectedAsset.name, selectedAsset.type)}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </>
  );
};

export default AssetsList;
