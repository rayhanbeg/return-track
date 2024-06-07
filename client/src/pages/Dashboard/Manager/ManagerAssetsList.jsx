import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';

const AssetList = () => {
  const axiosSecure = useAxiosSecure();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Assets Data
  const { data: assetsData = [], isLoading: assetsLoading, refetch } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/assets`);
      return data;
    },
    onSuccess: (data) => {
      setAssets(data);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (!assetsLoading) {
      setAssets(assetsData);
      setIsLoading(false);
    }
  }, [assetsData, assetsLoading]);

  // Mutation to handle asset deletion
  const { mutateAsync: deleteAsset } = useMutation({
    mutationFn: async (assetId) => {
      const { data } = await axiosSecure.delete(`/assets/${assetId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Asset deleted successfully.');
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete asset.');
    },
  });

  // Handle delete button click
  const handleDelete = async (assetId) => {
    try {
      await deleteAsset(assetId);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle update button click
  const handleUpdate = (assetId) => {
    // Implement update functionality here
    console.log(`Update asset with ID: ${assetId}`);
  };

  return (
    <>
      <Helmet>
        <title>Asset List</title>
      </Helmet>

      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
              <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                <table className='min-w-full leading-normal'>
                  <thead>
                    <tr>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                      >
                        Asset Name
                      </th>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                      >
                        Asset Type
                      </th>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                      >
                        Asset Quantity
                      </th>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                      >
                        Date Added
                      </th>
                      <th
                        scope='col'
                        className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset._id}>
                        <td className='px-5 py-5 border-b border-gray-200'>
                          <p className='text-gray-900 whitespace-no-wrap'>{asset.name}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200'>
                          <p className='text-gray-900 whitespace-no-wrap'>{asset.type}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200'>
                          <p className='text-gray-900 whitespace-no-wrap'>{asset.quantity}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200'>
                          <p className='text-gray-900 whitespace-no-wrap'>{new Date(asset.dateAdded).toLocaleDateString()}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200'>
                          <button
                            onClick={() => handleDelete(asset._id)}
                            className='text-red-600 hover:text-red-900 mr-2'
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleUpdate(asset._id)}
                            className='text-blue-600 hover:text-blue-900'
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AssetList;
