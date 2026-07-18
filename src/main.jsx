import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store, persistor } from "./utils/Redux/store.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { ProfileProvider } from "./utils/context/ProfileContext.jsx";
import { ForgotPassContextProvider } from "./utils/context/ForgotPasswordContext.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <React.StrictMode>
        <BrowserRouter>
          <ForgotPassContextProvider>
            <ProfileProvider>
              <App />
            </ProfileProvider>
          </ForgotPassContextProvider>
          <ToastContainer />
        </BrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
