import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import JoinEmployer from '../pages/SignUp/JoinEmployer'
import RoomDetails from '../pages/RoomDetails/RoomDetails'
import PrivateRoute from './PrivateRoute'
import Statics from '../pages/Dashboard/Common/Statics'
import MyListings from '../pages/Dashboard/Manager/MyEmployeeList'
import Profile from '../pages/Dashboard/Common/Profile'
import ManageUsers from '../pages/Dashboard/Admin/ManageUser'
import JoinManager from '../pages/SignUp/JoinManager'
import AddAsset from '../pages/Dashboard/Manager/AddAsset'
import MyEmployeeList from '../pages/Dashboard/Manager/MyEmployeeList'
import AssetsList from '../pages/Dashboard/Employee/AssetsList'
import MyAssets from '../pages/Dashboard/Employee/MyAssets'
import ManagerAssetsList from '../pages/Dashboard/Manager/ManagerAssetsList'
import AllRequests from '../pages/Dashboard/Manager/AllRequests'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: <PrivateRoute>
          <RoomDetails />
        </PrivateRoute>,
      },
      {
        path: '/add-asset',
        element: <AddAsset/>
      },
      {
        path: '/profile',
        element: <Profile/>
      },
      {
        path: '/employeeList',
        element: <MyEmployeeList/>
      },
      {
        path: '/assetsList',
        element: <AssetsList/>
      },
      {
        path: '/my-assets',
        element: <MyAssets/>
      },
      {
        path: '/assets-list',
        element: <ManagerAssetsList/>
      },
      {
        path: '/all-requests',
        element: <AllRequests/>
      },
      
      { path: '/join-employ', element: <JoinEmployer /> },
      { path: '/join-manager', element: <JoinManager /> },
    ],
  },
  { path: '/login', element: <Login /> },
  
  
])
