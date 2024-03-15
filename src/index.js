import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "~/App";
import GlobalStyles from "~/global/GlobalStyles";
import { AuthProvider } from "./contexts/AuthContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="431411978275-9b3a1hc5c9c5enhe5f6o57udm4od39pr.apps.googleusercontent.com">
      <GlobalStyles>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GlobalStyles>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
