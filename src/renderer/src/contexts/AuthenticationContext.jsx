import axios from "axios";
import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/appSlice";
import { getUser } from "../selector";

const AuthenticationContext = createContext(null);

const AuthenticationContextProvider = ({ children }) => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  async function validateLicenseKeyAndSetUser(licenseKey) {
    try {
      const HWID =
        "b157e660ccb4a55edc4b397ba62c782fd45270549a73143082f4c9272ba873d3"; // Hardcoded HWID for demo
      const response = await axios.post(
        `https://api.whop.com/api/v2/memberships/${licenseKey}/validate_license`,
        {
          metadata: { HWID },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`, // Replace with your API key
          },
        },
      );

      if (response.status === 200 && response.data.valid) {
        dispatch(setUser(response.data));
        return { success: true };
      } else {
        return { success: false, message: "License key validation failed." };
      }
    } catch (error) {
      console.error("Failed to validate license key:", error);
      return { success: false, message: "Error validating license key." };
    }
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        validateLicenseKeyAndSetUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticationContextProvider;

export function useAuthenticationContext() {
  const context = useContext(AuthenticationContext);
  if (!context) throw new Error("Auth Context must be provided");
  return context;
}
