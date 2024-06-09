import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from "react-icons/tb";

const JoinManager = () => {
  const { createUser, signInWithGoogle, updateUserProfile, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const companyName = form.companyName.value;
    const email = form.email.value;
    const birth = form.birth.value;
    const password = form.password.value;
    const image = form.image.files[0];
    const selectedPackage = form.package.value;
    const formData = new FormData();
    formData.append("image", image);

  

    try {
      setLoading(true);
      // Upload image and get image URL
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );

      const imageUrl = data.data.display_url
      console.log(imageUrl);

      
    const addInfo = {
      name,
      companyName,
      email,
      birth,
      password,
      package: selectedPackage,
    };
    // console.table(addInfo);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/manager`, addInfo);
      console.log(data);
      // navigate("/myFood");
    } catch (err) {
      console.log(err);
    }

      // User SignUp
      const result = await createUser(email, password);
      console.log(result);

      // Save username and photo in Firebase
      await updateUserProfile(name, data.data.display_url, companyName);

      // Save user role and status
      await saveUser({ email });

      navigate(from);
      toast.success('SignUp Successful');

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from);
      toast.success('SignUp Successful');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const saveUser = async (user) => {
    const currentUser = {
      email: user?.email,
      role: 'manager',
      status: 'verified'
    };
    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/user`, currentUser);
    return data;
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Join as HR Manager</h1>
          <p className="text-sm text-gray-400">Welcome to ReturnTrack</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 ng-untouched ng-pristine ng-valid"
        >
          <div className="space-y-4">
            <div className="lg:flex items-center gap-4">
            <div>
                <label htmlFor="name" className="block mb-2 text-sm">
                Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                  data-temp-mail-org="0"
                />
              </div>
            <div>
                <label htmlFor="companyName" className="block mb-2 text-sm">
                Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                  data-temp-mail-org="0"
                />
              </div>
            
            </div>
            <div>
                <label htmlFor="image" className="block mb-2 text-sm">
                Company Logo:
                </label>
                <input
                  required
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                />
              </div>
            <div className="lg:flex gap-4 items-center">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Enter Your Email Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                  data-temp-mail-org="0"
                />
              </div>
              <div>
                <label htmlFor="birth" className="block mb-2 text-sm">
                  Date of Birth
                </label>
                <input
                  type="datetime-local"
                  name="birth"
                  id="birth"
                  required
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                  data-temp-mail-org="0"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm mb-2">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                id="password"
                required
                placeholder="*******"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="package" className="block mb-2 text-sm">
                Select Package:
              </label>
              <select
                id="package"
                name="package"
                required
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
              >
                <option value="">Select a package</option>
                <option value="5 Members for $5">5 Members for $5</option>
                <option value="10 Members for $8">10 Members for $8</option>
                <option value="20 Members for $15">20 Members for $15</option>
              </select>
            </div>
          </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="bg-rose-500 w-full rounded-md py-3 text-white"
            >
              {loading ? <TbFidgetSpinner className="animate-spin m-auto" /> : 'Sign-Up'}
            </button>
          </div>
        </form>
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
          <p className="px-3 text-sm dark:text-gray-400">
            Signup with social accounts
          </p>
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
        </div>
        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer"
        >
          <FcGoogle size={32} />
          <p>Continue with Google</p>
        </button>
        <p className="px-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="hover:underline hover:text-rose-500 text-gray-600"
          >
            Login
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default JoinManager;
