import Container from "../Container";
import { AiOutlineMenu } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import avatarImg from "../../../assets/images/placeholder.jpg";
import HostRequestModal from "../../Modal/HostRequestModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useRole from "../../../hooks/useRole";
import logo from "../../../assets/images/logo.svg";

const Navbar = () => {
  const { user, logOut } = useAuth();
 
  const axiosSecure = useAxiosSecure();
  const [role, isLoading] = useRole();
  console.log(role);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dropdownRef = useRef(null);

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // handleModal
  const HandleModal = async () => {
    try {
      const currentUser = {
        email: user?.email,
        role: "guest",
        status: "requested",
      };
      const { data } = await axiosSecure.put(
        `${import.meta.env.VITE_API_URL}/user`,
        currentUser
      );
      console.log(data);
      if (data.modifiedCount > 0) {
        toast.success(
          "Requested successful! Please wait for admin confirmation"
        );
      } else {
        toast.error("Already requested! Please wait for admin approval");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeModal();
    }
  };

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row  items-center justify-between gap-3 md:gap-0">
            {/* Logo */}
            <NavLink to="/" className="text-[#35A6DE] font-bold">
              <img
                className="block w-24 h-full md:w-32 md:h-full lg:w-40 lg:h-full"
                src={logo}
                alt="logo"
                width="100"
                height="100"
              />
            </NavLink>
            {/* Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex flex-row items-center gap-3">
                {/* Become A Host btn */}
                <div className="hidden md:block">
                  <div className="flex gap-5 items-center">
                    {!user && (
                      <>
                        <NavLink
                          to="/"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Home</span>
                        </NavLink>

                        <NavLink
                          to="/join-employ"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Join as Employee</span>
                        </NavLink>
                        <NavLink
                          to="/join-manager"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Join as Manager</span>
                        </NavLink>
                      </>
                    )}

                    {role === "employer" && (
                      <>
                        <NavLink
                          to="/"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Home</span>
                        </NavLink>

                        <NavLink
                          to="/my-assets"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>My Assets</span>
                        </NavLink>

                        <NavLink
                          to="/my-team"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>My Team</span>
                        </NavLink>
                        <NavLink
                          to="/assetsList"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Request Assets</span>
                        </NavLink>
                      </>
                    )}

                    {role === "manager" && (
                      <>
                        <NavLink
                          to="/"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Home</span>
                        </NavLink>
                        <NavLink
                          to="/assets-list"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Assets List</span>
                        </NavLink>
                        <NavLink
                          to="/add-asset"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Add Assets</span>
                        </NavLink>
                        <NavLink
                          to="/all-requests"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>All Requests</span>
                        </NavLink>
                        <NavLink
                          to="/custom-request"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Custom Requests</span>
                        </NavLink>
                        <NavLink
                          to="/employeeList"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>My Employee</span>
                        </NavLink>
                        <NavLink
                          to="/add-employee"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Add an Employee</span>
                        </NavLink>
                        <NavLink
                          to="/profile"
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "text-[#35A6DE] border-2 px-4 py-2 rounded-lg border-[#35A6DE]"
                              : "hover:text-[#2b8cb7]"
                          }
                        >
                          <span>Profile</span>
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
                {/* modal */}
                <div>
                  <HostRequestModal
                    isOpenModal={isOpenModal}
                    closeModal={closeModal}
                    HandleModal={HandleModal}
                  />
                </div>
                {/* Dropdown btn */}
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                >
                  <AiOutlineMenu />
                  <div className="block md:flex items-center">
                    {/* Avatar */}
                    <img
                      className="rounded-full object-cover w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                      referrerPolicy="no-referrer"
                      src={user && user.photoURL ? user.photoURL : avatarImg}
                      alt="profile"
                    />
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm">
                  <div className="flex flex-col cursor-pointer">
                    {user ? (
                      <>
                        <div
                          onClick={handleLogout}
                          className="px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer"
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                        >
                          Login
                        </Link>
                        <Link
                          to="/"
                          className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                        >
                          Join as Employee
                        </Link>
                        <Link
                          to="/"
                          className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                        >
                          Join as HR Manager
                        </Link>
                      </>
                    )}

                    {role === "employer" && (
                      <>
                        <NavLink
                          to="/"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>Home</span>
                        </NavLink>

                        <NavLink
                          to="/my-assets"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>My Assets</span>
                        </NavLink>

                        <NavLink
                          to="/my-team"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>My Team</span>
                        </NavLink>
                        <NavLink
                          to="/assetsList"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>Request Asset</span>
                        </NavLink>
                      </>
                    )}

                    {role === "manager" && (
                      <>
                        <NavLink
                          to="/"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>Home</span>
                        </NavLink>
                        <NavLink
                          to="/assets-list"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>Asset List</span>
                        </NavLink>
                        <NavLink
                          to="/add-asset"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>Add Asset</span>
                        </NavLink>
                        <NavLink
                          to="/all-requests"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>All Requests</span>
                        </NavLink>
                        <NavLink
                          to="/custom-request"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>Custom Requests</span>
                        </NavLink>
                        <NavLink
                          to="/employeeList"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>My Employee</span>
                        </NavLink>
                        <NavLink
                          to="/add-employee"
                          className={({ isActive, isPending }) =>
                            `block md:hidden px-2 py-2 hover:bg-neutral-100 transition font-semibold ${
                              isPending
                                ? "pending"
                                : isActive
                                ? "text-[#35A6DE] border-2 px-2 py-2 rounded-lg border-[#35A6DE]"
                                : "hover:text-[#2b8cb7]"
                            }`
                          }
                        >
                          <span>Add Employee</span>
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
