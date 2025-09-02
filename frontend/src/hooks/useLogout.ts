import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

export const usePerformLogout = () => {
  const navigate = useNavigate();
  
  return useCallback(() => {
    navigate("/account", { replace: true });
  }, [navigate]);
};

export const useClearAccessAndLogout = () => {
  /**
   * `useClearAccessAndLogout will check if access token exists,
   *  logout if not, set a 24 hour timer to clear access token
   *  and log out
   *
   */
  const performLogout = usePerformLogout();

  const clearAccessAndLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    performLogout();
  }, [performLogout]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      performLogout();
      return;
    }

    const refreshTime = 1000 * 60 * 60 * 24; // 24 hours
    const intervalId = setInterval( async () => {
      clearAccessAndLogout();
    }, refreshTime);

    return () => clearInterval(intervalId);
  }, [performLogout, clearAccessAndLogout]);

  return { clearAccessAndLogout };
};
