import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { publicRoutes } from "~/routes";
import { MessageProvider } from "./contexts/MessageContext";
import { PackageProvider } from "./contexts/PackageContext";

import Explore from "./pages/Explore";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import NotFound from "./components/NotFound";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <MessageProvider>
      <PackageProvider>
        <Router>
          <div className="App">
            <ToastContainer />
            <Routes>
              <Route path="*" element={<NotFound />} />
              {publicRoutes.map((route, index) => {
                let Page = route.component;
                if (route.path === "/") {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        isLoggedIn ? (
                          <Home onLogout={handleLogout} />
                        ) : (
                          <LandingPage onLogin={handleLogin} />
                        )
                      }
                    />
                  );
                } else if (route.path === "/ideas") {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        isLoggedIn ? (
                          <Home onLogout={handleLogout} />
                        ) : (
                          <Explore onLogin={handleLogin} />
                        )
                      }
                    />
                  );
                }

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      isLoggedIn ? (
                        <Page onLogout={handleLogout} />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />
                );
              })}
            </Routes>
          </div>
        </Router>
      </PackageProvider>
    </MessageProvider>
  );
}

export default App;
