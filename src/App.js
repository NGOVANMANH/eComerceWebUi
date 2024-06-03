import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import DefaultLayout from './components/layouts/DefaultLayout';
import AdminLayout from './components/layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Products from './pages/admin/Products';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/sell/Home';
import Cart from './pages/sell/Cart';
import Profile from './pages/auth/Profile';
import Product from './pages/sell/Product';
import Order from './pages/sell/Order';
import Orders from './pages/admin/Orders';
import OrderOffline from './pages/admin/OrderOffline';
import VouchersAdmin from './pages/admin/Vouchers';
import VouchersSell from './pages/sell/Vouchers';

function App() {
  const router = createBrowserRouter([
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: 'users',
          element:
            <Users />
        },
        {
          path: 'products',
          element: <Products />
        },
        {
          path: 'orders',
          element: <Orders />
        },
        {
          path: 'make-order',
          element: <OrderOffline />
        },
        {
          path: 'vouchers',
          element: <VouchersAdmin />
        },
      ]
    },
    {
      path: '/auth',
      element: <><Outlet /></>,
      children: [
        {
          index: true,
          element: <Login />
        },
        {
          path: 'register',
          element: <Register />
        },
        {
          path: 'forgot-password',
          element: <h1>Forgot Password</h1>
        },
        {
          path: 'reset-password',
          element: <h1>Reset Password</h1>
        },
        {
          path: 'verify-email',
          element: <h1>Verify Email</h1>
        },
      ]
    },
    {
      path: '/',
      element: <DefaultLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: '/about',
          element: <h1>About</h1>
        },
        {
          path: '/profile',
          element: <Profile />
        }
        ,
        {
          path: '/order',
          element: <Order />
        }
        ,
        {
          path: '/cart',
          element: <Cart />
        },
        {
          path: '/vouchers',
          element: <VouchersSell />
        },
        {
          path: '/products/:productId',
          element: <Product />
        }
        ,
        {
          path: '*',
          element: <h1>Not Found</h1>
        },
      ]
    },
  ]);
  return (
    <ShopProvider>
      <AuthProvider>
        <ToastContainer
          position="bottom-left"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        <RouterProvider router={router} />
      </AuthProvider>
    </ShopProvider>
  );
}

export default App;
