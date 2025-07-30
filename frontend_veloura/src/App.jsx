import axios from "axios";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AboutUs from "./pages/user/about";
import LoginPage from "./pages/Auth/login";
import RegisterPage from "./pages/Auth/register";
import Cart from "./pages/user/cart";
import Checkout from "./pages/user/checkout";
import ContactUs from "./pages/user/contact";
import ProductDetails from "./pages/user/detailspage";
import JewelryFilter from "./pages/user/filter";
import ForgotPassword from "./pages/forgotpassword/forgot passord";
import VerificationCode from "./pages/forgotpassword/pin";
import SetNewPassword from "./pages/forgotpassword/resetpassword";
import Home from "./pages/homepage";
import NotificationPage from "./pages/user/notification";
import OrderConfirmation from "./pages/user/orderconfirmation";
import PaymentUI from "./pages/user/payment";
import ProfileEdit from "./pages/user/profile";
import MyOrders from "./pages/user/myorder";
import Wishlist from "./pages/user/wishlist";
import CategoryAdmin from "./pages/admin/category";
import ReturnPolicyAdmin from "./pages/admin/returnpolicy";
import ShippingRateAdmin from "./pages/admin/shipping";
import SizeGuideAdmin from "./pages/admin/sizeguide";
import JewelryAdminPage from "./pages/admin/jewlery";
import UserProtectedRoute from "./routes/userroute";
import AdminProtectedRoute from "./routes/adminroute";
import UnAuthorized from "./pages/unauthorized";
import SearchResultsPage from "./components/search";
import OtpVerification from "./pages/Auth/otp-verify";
import SuccessPage from "./pages/user/SuccessPage";
import AdminOrderManagement from "./pages/admin/order";
import DashboardPage from "./pages/admin/dashboard";
import ActivityLogs from "./pages/admin/user";



axios.defaults.baseURL = "https://localhost:3001";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={2000} />
       <Routes>
        {/* Public Routes (Guest) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/pin" element={<VerificationCode />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/filter" element={<JewelryFilter />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/otp-verify" element={<OtpVerification />} />

        {/* User Protected Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<PaymentUI />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/order-confirmation/:orderNumber"element={<OrderConfirmation />}/>
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/success" element={<SuccessPage />} />
          
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/jewelry" element={<JewelryAdminPage />} />
          <Route path="/admin/categories" element={<CategoryAdmin />} />
          <Route path="/admin/return-policy" element={<ReturnPolicyAdmin />} />
          <Route path="/admin/shipping-rate" element={<ShippingRateAdmin />} />
          <Route path="/admin/size-guide" element={<SizeGuideAdmin />} />
          <Route path="/admin/orders" element={<AdminOrderManagement />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/user" element={<ActivityLogs />} />
         
        </Route>

        <Route path="/unauthorized" element={<UnAuthorized />} />
      </Routes>
    </>
  );
};
export default App;
