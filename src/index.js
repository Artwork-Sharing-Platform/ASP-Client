import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "~/App";
import GlobalStyles from "~/global/GlobalStyles";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="431411978275-9b3a1hc5c9c5enhe5f6o57udm4od39pr.apps.googleusercontent.com">
      <GlobalStyles>
        <App />
      </GlobalStyles>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
