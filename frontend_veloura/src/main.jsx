import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/authconetxt.jsx";
import { WishlistProvider } from "./context/wishlistcontext.jsx";
import { CartProvider } from "./context/cartcontext.jsx";
import { OrderProvider } from "./context/ordercontext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
        <App />
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </Router>
);
