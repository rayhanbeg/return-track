import { Helmet } from 'react-helmet-async';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';

const Profile = () => {
  const { user, loading } = useAuth() || {};
  const [role, isLoading] = useRole();

  if (isLoading || loading) return <LoadingSpinner />;

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className='bg-white shadow-lg rounded-2xl w-full md:w-3/4 lg:w-2/4'>
        <div className='relative'>
          <div className='bg-gradient-to-r from-[#35A6DE] to-[#4F4A85] h-36 rounded-t-2xl flex items-center justify-center'>
            <p className='text-white text-lg font-bold'>Welcome to Your Profile</p>
          </div>
          <a href='#' className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <img
              alt='profile'
              src={user?.photoURL}
              className='mx-auto object-cover rounded-full h-24 w-24 border-4 border-white shadow-lg'
            />
          </a>
        </div>
        <div className='flex flex-col items-center p-4 mt-12'>
          <p className='p-2 uppercase px-4 text-xs text-white bg-[#35A6DE] rounded-full shadow'>
            {role}
          </p>
          <p className='mt-2 text-xl font-medium text-gray-800'>
            User Id: {user?.uid}
          </p>
          <div className='w-full p-4 mt-4 rounded-lg bg-gray-50'>
            <div className='flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 space-y-2 md:space-y-0 md:space-x-4'>
              <p className='flex flex-col items-center'>
                Name
                <span className='font-bold text-black'>{user?.displayName}</span>
              </p>
              <p className='flex flex-col items-center'>
                Email
                <span className='font-bold text-black'>{user?.email}</span>
              </p>
            </div>
            <div className='flex flex-col md:flex-row items-center justify-center mt-4 space-y-2 md:space-y-0 md:space-x-4'>
              <button className='bg-gradient-to-r from-[#35A6DE] to-[#4F4A85] px-4 py-2 rounded-lg text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300'>
                Update Profile
              </button>
              <button className='bg-gradient-to-r from-[#35A6DE] to-[#4F4A85] px-4 py-2 rounded-lg text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300'>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
