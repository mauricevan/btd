import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/global.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { TaskProvider } from "./context/TaskContext";
import { CustomerProvider } from "./context/CustomerContext";
import { ProductProvider } from "./context/ProductContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <LanguageProvider>
            <NotificationProvider>
              <TaskProvider>
                <CustomerProvider>
                  <ProductProvider>
                    <App />
                  </ProductProvider>
                </CustomerProvider>
              </TaskProvider>
            </NotificationProvider>
          </LanguageProvider>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
); 