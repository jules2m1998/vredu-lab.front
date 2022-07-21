import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import UserForm from "./pages/UserForm";
import Settings from "./pages/Settings";
import Textures from "./pages/Textures";
import RegisterTexture from "./pages/RegisterTexture";
import {UpdateTexture} from "./pages/UpdateTexture";
import RegisterEquipment from "./pages/RegisterEquipment";

// ----------------------------------------------------------------------

export default function Router({isLogIn = false}) {
  return useRoutes([
    {
      path: '/dashboard',
      element: isLogIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user/list', element: <User /> },
        { path: 'user/form', element: <UserForm /> },
        { path: 'user/form/:id', element: <UserForm /> },
        { path: 'account', element: <Settings /> },
        { path: 'effects/list', element: <Settings /> },
        { path: 'effects/typeform', element: <Settings /> },
        { path: 'textures/list', element: <Textures /> },
        { path: 'textures/form', element: <RegisterTexture /> },
        { path: 'equipments/form', element: <RegisterEquipment /> },
        { path: 'equipments/form/:id', element: <RegisterEquipment /> },
        { path: 'equipments/list', element: <Blog /> },
        { path: 'textures/form/:id', element: <UpdateTexture /> },
        { path: 'blog', element: <Blog /> },
        { path: '', element: <Navigate to="/dashboard/app" /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
