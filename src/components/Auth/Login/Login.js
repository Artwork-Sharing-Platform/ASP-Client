import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import api from "~/services/apiService";
import { encryptUserId } from "~/utils/hashUserId";
import { AuthContext } from "~/contexts/AuthContext";
import { PackageContext } from "~/contexts/PackageContext";
import { fetchFeatureByUserId } from "~/services/packageService";
import { fetchGetConversation } from "~/services/conversationService";

import TokenService from "~/services/tokenService";
import LoadingSpinner from "~/components/LoadingSpinner";

import Logo from "~/assets/images/logo.png";
import googleIcon from "~/assets/images/googleIcon.png";
import styles from "./Login.module.scss";
import { MessageContext } from "~/contexts/MessageContext";

const cx = classNames.bind(styles);
function Login({ setShowLogin, setShowSignup, onLogin }) {
  const navigate = useNavigate();
  const { setUserId } = useContext(AuthContext);
  const { setFeature } = useContext(PackageContext);
  const { setConversations } = useContext(MessageContext);
  const [googleInfo, setGoogleInfo] = useState(null);
  const [loginData, setLoginData] = useState({
    email: null,
    password: null,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleInfo(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (googleInfo) {
      setLoading(true);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleInfo.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${googleInfo.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then(async (res) => {
          // Make the callback function async
          const userData = res.data;
          try {
            const response = await api.post("/auth/google", userData);
            const user = response.data.user;
            const accessToken = response.data.tokens.accessToken;
            const refreshToken = response.data.tokens.refreshToken;
            TokenService.setAccessToken(accessToken);
            TokenService.setRefreshToken(refreshToken);
            const decodeAccessToken = jwtDecode(accessToken);
            const userId = decodeAccessToken.userId;
            const encodeUserId = encryptUserId(
              userId,
              process.env.REACT_APP_SECRET_KEY_ENCODE
            );
            setUserId(encodeUserId);
            const feature = await fetchFeatureByUserId(userId);
            setFeature(feature);
            const conversations = await fetchGetConversation(userId);
            setConversations(conversations);
            setLoading(false);
            if (user.type === "Admin") {
              navigate("/admin");
            }
            onLogin();
          } catch (error) {
            const errorMessage = error.response.data.message;
            setLoading(false);
            setErrorMsg(errorMessage);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [googleInfo, navigate, onLogin, setConversations, setFeature, setUserId]);

  const handleChangeEmail = (e) => {
    setLoginData({ ...loginData, email: e.target.value });
  };

  const handleChangePassword = (e) => {
    setLoginData({ ...loginData, password: e.target.value });
  };

  const handleLogin = () => {
    setLoading(true);
    api
      .post("/auth/login", loginData)
      .then(async (response) => {
        try {
          const user = response.data.user;
          const accessToken = response.data.tokens.accessToken;
          const refreshToken = response.data.tokens.refreshToken;
          TokenService.setAccessToken(accessToken);
          TokenService.setRefreshToken(refreshToken);
          const decodeAccessToken = jwtDecode(accessToken);
          const userId = decodeAccessToken.userId;
          const encodeUserId = encryptUserId(
            userId,
            process.env.REACT_APP_SECRET_KEY_ENCODE
          );
          setUserId(encodeUserId);
          const feature = await fetchFeatureByUserId(userId);
          setFeature(feature);
          const conversations = await fetchGetConversation(userId);
          setConversations(conversations);
          setLoading(false);
          if (user.type === "Admin") {
            navigate("/admin");
          }
          onLogin();
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        setLoading(false);
        setErrorMsg(errorMessage);
      });
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  const handleClickSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <>
      {loading && <LoadingSpinner loading={loading} />}
      <div className={cx("login-wrapper")}>
        <div className={cx("login-container")}>
          <div className={cx("close")} onClick={() => setShowLogin(false)}>
            <div className={cx("close-btn")}>
              <i className={cx("fa-solid fa-xmark", "icon")}></i>
            </div>
          </div>
          <div className={cx("logo")}>
            <img src={Logo} alt="logo-img" className={cx("logo-image")} />
          </div>
          <div className={cx("welcome")}>
            <div className={cx("text")}>Welcome to Pesterin</div>
          </div>

          <div className={cx("form-login-wrapper")}>
            <div className={cx("form-login-container")}>
              {/* Form login */}
              <div className={cx("form-content")}>
                {/* Email */}
                <div className={cx("email")}>
                  <div className={cx("email-text")}>Email</div>
                  <div className={cx("email-input")}>
                    <input
                      type="text"
                      placeholder="Email"
                      spellCheck={false}
                      autoFocus={true}
                      className={cx("input")}
                      onChange={handleChangeEmail}
                    />
                  </div>
                </div>
                {/* Password */}
                <div className={cx("password")}>
                  <div className={cx("password-text")}>Password</div>
                  <div className={cx("password-input")}>
                    <input
                      type="password"
                      placeholder="Password"
                      spellCheck={false}
                      className={cx("input")}
                      onChange={handleChangePassword}
                      onKeyDown={handlePressEnter}
                    />
                  </div>
                </div>
                {/* Error Message */}
                {errorMsg && (
                  <div className={cx("error-message")}>{errorMsg}</div>
                )}
                {/* Forget password */}
                <div className={cx("forgot-password")}>
                  <Link to="/reset" className={cx("reset")}>
                    Forgot your password?
                  </Link>
                </div>

                {/* Login button */}
                <div className={cx("login-btn")}>
                  <button className={cx("btn")} onClick={handleLogin}>
                    Log in
                  </button>
                </div>
              </div>
              <div className={cx("or")}>OR</div>
              {/* Login google */}
              <div
                className={cx("login-google-action")}
                onClick={() => loginGoogle()}
              >
                <button className={cx("login-google-btn")}>
                  <img
                    src={googleIcon}
                    alt="google-icon"
                    className={cx("google-icon")}
                  />
                  <span className={cx("text")}>Continue with google</span>
                  <span className={cx("empty")}></span>
                </button>
              </div>

              {/* Information text */}
              <div className={cx("information")}>
                <div className={cx("text")}>
                  By continuing, you agree to Pesterin's.{" "}
                  <span className={cx("mark")}>Terms of Service</span> and
                  acknowledge you've read our.{" "}
                  <span className={cx("mark")}>Privacy Policy</span>.{" "}
                  <span className={cx("mark")}>Notice at collection</span>
                </div>
              </div>

              {/* Line */}
              <div className={cx("line")}>
                <div className={cx("line-inside")}></div>
              </div>

              {/* Signup */}
              <div className={cx("signup")}>
                <div className={cx("signup-content")}>
                  <div className={cx("main-text")}>
                    Not on Pesterin yet?{" "}
                    <span className={cx("mark")} onClick={handleClickSignup}>
                      {" "}
                      Sign up
                    </span>
                  </div>
                  <div className={cx("sub-text")}>
                    Are you a business?{" "}
                    <span className={cx("mark")}>Get started here!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
