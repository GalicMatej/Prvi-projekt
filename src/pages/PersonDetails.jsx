import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: blue;
    height: 470px;
    margin: 50px;
`;

const StyledButton = styled.button`
    background-color: purple;
    border: none;
    border-radius: 10%;
    font-size: 1.5rem;
    /* padding: 1rem 1.5rem; */
    text-align: center;
`;

function PersonDetails() {
    const { loginWithRedirect, isAuthenticated, isLoading, user, logout } = useAuth0();
    const navigate = useNavigate();
    
    const userID = localStorage.getItem("userID");
    // console.log(userID)

    const [OIB, setOIB] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [createdAt, setCreatedAt] = useState("");

    useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!isAuthenticated && !isLoading) {
            loginWithRedirect();
        }else if(isAuthenticated && userID) {
            navigate(`/user/${userID}`)
        }else {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/get-user-data?id=${userID}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
            
                    if(!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
            
                    const result = await response.json();
                    console.log(result)
                    setOIB(result[0].oib);
                    setFirstName(result[0].first_name);
                    setLastName(result[0].last_name);
            
                    const tempDate = result[0].created_at;
                    const date = new Date(tempDate);
                    const formattedDate = date.toLocaleString();
                    setCreatedAt(formattedDate);
                            
                } catch (error) {
                    console.log("Error fetching user data:", error);
                }
            }
            fetchUserData();
        }

    }, [loginWithRedirect, isAuthenticated, isLoading, navigate, userID]);

    // Show loading state while Auth0 is checking authentication
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // const location = useLocation();
    // // console.log(location.state.user.given_name);

    // const data = useParams();
    // const id = data.id;
    // // console.log(data.id)

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:3000/get-user-data?id=${id}`, {
    //                 method: "GET",
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 }
    //             });

    //             if(!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }

    //             const result = await response.json();
    //             console.log(result)
    //             setOIB(result[0].oib);
    //             setFirstName(result[0].first_name);
    //             setLastName(result[0].last_name);

    //             const tempDate = result[0].created_at;
    //             const date = new Date(tempDate);
    //             const formattedDate = date.toLocaleString();
    //             setCreatedAt(formattedDate);
                
    //         } catch (error) {
    //             console.log("Error fetching user data:", error);
    //         }
    //     }
    //     fetchUserData();
    // }, [id])

    // If authenticated, display user information
    if (isAuthenticated && user) {
        return (
            <StyledDiv>
                <h1>Personal info</h1>
                {/* <p>First Name: {user.given_name}</p>
                <p>Last Name: {user.family_name}</p>
                <p>Email: {user.email}</p>
                <p>Nickname: {user.nickname}</p> */}
                <h2>OIB: {OIB}</h2>
                <h2>First name: {firstName}</h2>
                <h2>Last name: {lastName}</h2>
                <h2>Logged user: {user.name}</h2>
                <h2>Time of creation: {createdAt}</h2>
                <StyledButton onClick={() => logout({ returnTo: window.location.origin })}>
                    Logout
                </StyledButton>
            </StyledDiv>
        );
    }

    return <div>Please log in.</div>;
}

export default PersonDetails;