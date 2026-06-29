import {Routes,Route, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuDetails from "./pages/MenuDetails";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import BookTable from "./pages/BookTable";
import MyBooking from "./pages/MyBooking";
import MyOrder from "./pages/MyOrder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


const App = () => {
  const adminPath=useLocation().pathname.includes("admin")
  return (
    <div>
      { !adminPath && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu-details/:id" element={<MenuDetails/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/book_table" element={<BookTable/>} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/my-orders" element={<MyOrder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />


      </Routes>
      {!adminPath && <Footer />}
    </div>
  );
};

export default App
