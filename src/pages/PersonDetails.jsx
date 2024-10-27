import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    /* background-color: blue; */
    background-color: lightblue;
    height: 490px;
    margin: 50px;
`;

// const StyledButton = styled.button`
//     background-color: purple;
//     border: none;
//     border-radius: 10%;
//     font-size: 1.5rem;
//     /* padding: 1rem 1.5rem; */
//     text-align: center;
// `;

const StyledButton = styled.button`
    color: white;
    /* background-color: #312e81; */
    background-color: purple;
    font-size: 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: 10%;
    border: none;
    text-align: center;
    /* align-items: center; */

    &:hover{
        background-color: #4338ca;
    }
`;

function PersonDetails() {
    const { loginWithRedirect, isAuthenticated, isLoading, user, logout } = useAuth0();
    const navigate = useNavigate();
    // const userID = localStorage.getItem("userID");
    // console.log(userID)

    const [OIB, setOIB] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [createdAt, setCreatedAt] = useState("");

    const temp = useParams().id;
    console.log("temp:", temp)

    const handleClick = () => {
        localStorage.setItem("userID", null);
        logout({ returnTo: window.location.origin })
    }

    useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!isAuthenticated && !isLoading) {
            localStorage.setItem("userID", temp);
            loginWithRedirect();
        // }
        // else if(isAuthenticated && userID) {
        //     navigate(`/user/${userID}`)
        }else {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`https://backend-tyyf.onrender.com/get-user-data?id=${temp}`, {
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

    }, [loginWithRedirect, isAuthenticated, isLoading, navigate, temp]);

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

    if (isAuthenticated && user) {
        return (
            <StyledDiv>
                <h1>Personal info</h1>
                <h2>OIB: {OIB}</h2>
                <h2>First name: {firstName}</h2>
                <h2>Last name: {lastName}</h2>
                <h2>Logged user: {user.name}</h2>
                <h2>Time of creation: {createdAt}</h2>
                <StyledButton onClick={handleClick}>
                    Logout
                </StyledButton>
            </StyledDiv>
        );
    }

    return <div>Please log in.</div>;
}

export default PersonDetails;

// () => logout({ returnTo: window.location.origin })