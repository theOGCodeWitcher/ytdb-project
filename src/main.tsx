import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Auth0ProviderWithNavigate } from "./components/Auth0ProviderWithNavigate.tsx";
import UserProvider from "./context/UserProvider.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <BrowserRouter>
          <Auth0ProviderWithNavigate>
            <App />
          </Auth0ProviderWithNavigate>
        </BrowserRouter>
      </UserProvider>
    </Provider>
  </React.StrictMode>
);
