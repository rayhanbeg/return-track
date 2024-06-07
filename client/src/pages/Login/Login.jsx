import { Link, useLocation } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from "react-icons/tb"
import { useState } from 'react';

const Login = () => {
  const { signIn, signInWithGoogle, loading, setLoading, resetPassword } = useAuth();
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const location = useLocation()
  const from = location?.state || '/'

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    setEmail(email)
    const password = form.password.value;

    try {
      setLoading(true)
   
      // 1. SignIn user
      await signIn(email, password)
      navigate(from);
      toast.success('Login Successful');
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setLoading(false)
    }
  };

  // reset password
  const handleResetPassword = async () => {
    if(!email) return toast.error('Please write your email first in input')
    try {
      await resetPassword(email)
      toast.success('Request successful! Check your email for further process...');
      document.getElementById('reset_password_modal').close(); // Close the modal
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setLoading(false)
    }
  }

  // handle google signIn
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      navigate(from)
      toast.success('SignUp Successful')
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div>
    <div className='flex justify-center items-center min-h-screen'>
      <div className='flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Log In</h1>
          <p className='text-sm text-gray-400'>
            Sign in to access your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6 ng-untouched ng-pristine ng-valid'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>
                Email address
              </label>
              <input
                onChange={e => setEmail(e.target.value)}
                type='email'
                name='email'
                id='email'
                required
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900'
              />
            </div>
            <div>
              <div className='flex justify-between'>
                <label htmlFor='password' className='text-sm mb-2'>
                  Password
                </label>
              </div>
              <input
                type='password'
                name='password'
                autoComplete='current-password'
                id='password'
                required
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900'
              />
            </div>
          </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="bg-rose-500 w-full rounded-md py-3 text-white"
            >
              {loading ? <TbFidgetSpinner className="animate-spin m-auto"/> : 'Sign In'}
            </button>
          </div>
        </form>
        <div className='space-y-1'>
          <button 
            onClick={() => document.getElementById('reset_password_modal').showModal()}
            className='text-xs hover:underline hover:text-rose-500 text-gray-400'
          >
            Forgot password?
          </button>
         
        </div>
        <div className='flex items-center pt-4 space-x-1'>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
          <p className='px-3 text-sm dark:text-gray-400'>
            Login with social accounts
          </p>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
        </div>
        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer">
          <FcGoogle size={32} />
          <p>Continue with Google</p>
        </button>
        <p className='px-6 text-sm text-center text-gray-400'>
          Don&apos;t have an account yet?{' '}
          <Link
            to='/signup'
            className='hover:underline hover:text-rose-500 text-gray-600'
          >
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
    {/* modal */}
    <dialog id="reset_password_modal" className="fixed inset-0 modal modal-bottom sm:modal-middle bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg">
              <h3 className="font-bold text-lg">Reset Password</h3>
              <p className="py-4">Enter your email address to reset your password.</p>
              <input
                onChange={e => setEmail(e.target.value)}
                type='email'
                name='resetEmail'
                id='resetEmail'
                required
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900 mb-4'
              />
              {
                email ? (
                  <div className="modal-action">
                    <button onClick={handleResetPassword} className="btn bg-rose-500 rounded-md p-1 text-white">Reset Password</button>
                  </div>
                ) : (
                  <button onClick={() => document.getElementById('reset_password_modal').close()} className="btn hover:underline hover:text-rose-500 text-gray-600">Close</button>
                )
              }
            </div>
          </dialog>
    </div>
  )
}

export default Login
