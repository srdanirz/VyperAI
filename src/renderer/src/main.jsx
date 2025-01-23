import "./assets/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, HashRouter } from "react-router-dom";
import AuthenticationContextProvider from "./contexts/AuthenticationContext";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthenticationContextProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </AuthenticationContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
