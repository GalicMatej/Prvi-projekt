import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 150px;
    gap: 20px;
`;

const Styledh1 = styled.h1`
    /* display: flex;
    flex-direction: column;
    align-items: center; */
    margin: 0;
`;

const StyledButton = styled.button`
    color: white;
    /* background-color: #312e81; */
    background-color: purple;
    font-size: 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: 15%;
    border: none;
    text-align: center;

    &:hover{
        background-color: #4338ca;
    }
`;

function MainPage() {
    const [number, setNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    function handleClick() {
        navigate("/generateQrCode", {state: {data: token}})
    };

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch("https://backend-tyyf.onrender.com/get-token", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                setToken(result.access_token);
            } catch (error) {
                console.log("Error while fetching token!!!");
            }
        }
        fetchToken();
    }, []);

    useEffect(() => {
        const fetchNumberOfTickets = async () => {

            if(!token) return;
            try {
                setLoading(true);
                const response = await fetch("https://backend-tyyf.onrender.com/get-all-users", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const result = await response.json(); 
                setNumber(result[0].count);
                setLoading(false);

            }
            catch (error) {
                console.error("Error:", error);
            }
        };
        fetchNumberOfTickets();
    }, [token]); 

    return (
        <StyledDiv>
            <Styledh1>Number of generated tickets: {loading ? "Loading..." : number}</Styledh1>

            <StyledButton onClick={handleClick}>Generate QRcode</StyledButton>
        </StyledDiv>
    )
}

export default MainPage;
