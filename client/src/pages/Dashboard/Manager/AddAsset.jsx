import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddAsset = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: async productData => {
      const { data } = await axiosSecure.post(`/asset`, productData);
      return data;
    },
    onSuccess: () => {
      toast.success('Product Added Successfully!');
      navigate('/dashboard/MyProducts');
      setLoading(false);
    },
  });

  // Form handler
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const productName = form.productName.value;
    const productType = form.productType.value;
    const productQuantity = form.productQuantity.value;

    const productData = {
      name: productName,
      type: productType,
      quantity: productQuantity,
      manager: {
        name: user?.displayName,
        image: user?.photoURL,
        email: user?.email,
      },
    };

    try {
      // Post request to server
      await mutateAsync(productData);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Product | Dashboard</title>
      </Helmet>

      {/* Form */}
      <div className=' lg:my-20'>
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 capitalize">Add Product</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700" htmlFor="productName">Product Name</label>
              <input
                id="productName"
                name="productName"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-[#35A6DE] focus:ring-[#35A6DE] focus:ring-opacity-40 focus:outline-none focus:ring"
                required
              />
            </div>

            <div>
              <label className="text-gray-700" htmlFor="productType">Product Type</label>
              <select
                id="productType"
                name="productType"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-[#35A6DE] focus:ring-[#35A6DE] focus:ring-opacity-40 focus:outline-none focus:ring"
                required
              >
                
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
            </div>

            <div>
              <label className="text-gray-700" htmlFor="productQuantity">Product Quantity</label>
              <input
                id="productQuantity"
                name="productQuantity"
                type="number"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-[#35A6DE] focus:ring-[#35A6DE] focus:ring-opacity-40 focus:outline-none focus:ring"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className={`px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#35A6DE] rounded-md hover:bg-[#2b8cb7] focus:outline-none focus:bg-[#2b8cb7] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </section>
      </div>
    </>
  );
};

export default AddAsset;
