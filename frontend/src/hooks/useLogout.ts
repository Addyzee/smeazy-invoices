import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserDetailsStore } from "../store";

export const usePerformLogout = () => {
  const navigate = useNavigate();
  const { useGuestAccount, setUseGuestAccount } = useUserDetailsStore();

  return useCallback(() => {
    if (useGuestAccount) {
      setUseGuestAccount(false);
      navigate("/account", { replace: true });
      return;
    }

    // Regular user logout
    localStorage.removeItem("access_token");
    navigate("/account", { replace: true });
  }, [navigate, useGuestAccount, setUseGuestAccount]);
};

export const useClearAccessAndLogout = () => {
  /**
   * `useClearAccessAndLogout` will check if access token exists,
   *  logout if not, set a 24 hour timer to clear access token
   *  and log out
   */
  const performLogout = usePerformLogout();
  const { useGuestAccount } = useUserDetailsStore();

  const clearAccessAndLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    performLogout();
  }, [performLogout]);

  useEffect(() => {
    // Guest users don't need token validation
    if (useGuestAccount) {
      return;
    }

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      performLogout();
      return;
    }

    const refreshTime = 1000 * 60 * 60 * 24; // 24 hours
    const intervalId = setInterval(() => {
      clearAccessAndLogout();
    }, refreshTime);

    return () => clearInterval(intervalId);
  }, [performLogout, clearAccessAndLogout, useGuestAccount]);

  return { clearAccessAndLogout };
};
