import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
    const navigate = useNavigate();
    
    const userID = localStorage.getItem("userID");
    // console.log(userID)

    useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!isAuthenticated && !isLoading) {
            loginWithRedirect();
        }else if(isAuthenticated && userID) {
            navigate(`/user/${userID}`, {state: {user}})
        }
    }, [loginWithRedirect, isAuthenticated, isLoading, navigate, userID, user]);

    // Show loading state while Auth0 is checking authentication
    if (isLoading) {
        return <div>Loading...</div>;
    }
    console.log(user)

  return (
    <div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default Callback;