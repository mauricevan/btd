import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "../pages/Home";
import About from "../pages/About";
import Webshop from "../pages/Webshop";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import ProductPage from "../pages/ProductPage";
import OrderPage from "../pages/OrderPage";
import DemoPage from "../pages/DemoPage";
import NotFound from "../pages/NotFound";
import AdminTasks from "../pages/AdminTasks";
import UserTasks from "../pages/UserTasks";
import AdminDashboard from "../pages/AdminDashboard";
import Customers from "../pages/admin/Customers";
import CustomerDetail from "../pages/admin/CustomerDetail";
import CustomerForm from "../pages/admin/CustomerForm";
import Users from "../pages/admin/Users";
import Inventory from "../pages/admin/Inventory";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <About />
            </motion.div>
          }
        />
        <Route
          path="/webshop"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <Webshop />
            </motion.div>
          }
        />
        <Route
          path="/cart"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <Cart />
            </motion.div>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <ProductPage />
            </motion.div>
          }
        />
        <Route
          path="/order/:slug"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <OrderPage />
            </motion.div>
          }
        />
        <Route
          path="/demo/:slug"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <DemoPage />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <Register />
            </motion.div>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <Inventory />
            </motion.div>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <Customers />
            </motion.div>
          }
        />
        <Route
          path="/admin/customers/new"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <CustomerForm />
            </motion.div>
          }
        />
        <Route
          path="/admin/customers/:id/edit"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <CustomerForm />
            </motion.div>
          }
        />
        <Route
          path="/admin/customers/:id"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <CustomerDetail />
            </motion.div>
          }
        />
        <Route
          path="/admin/users"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <Users />
            </motion.div>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <AdminTasks />
            </motion.div>
          }
        />
        <Route
          path="/user/tasks"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <UserTasks />
            </motion.div>
          }
        />
        <Route
          path="/admin"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <AdminDashboard />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div {...pageVariants} initial="initial" animate="animate" exit="exit">
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
} 