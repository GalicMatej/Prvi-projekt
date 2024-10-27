import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: blue; */
    background-color: lightblue;
    height: 580px;
    /* width: 300px; */
    border-radius: 10px;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const StyledInput = styled.input`
    margin-bottom: 15px; 
    padding: 15px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    font-size: 16px; 
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

    &:hover{
        background-color: #4338ca;
    }
`;

function Generating() {
    const [OIB, setOIB] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [qrcodeUrl, setQrcodeUrl] = useState("");
    const [link, setLink] = useState(null);
    const [token, setToken] = useState(null);

    const location = useLocation();

    useEffect(() => {
        if(location.state?.data) {
            setToken(location.state.data);
        } else {
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
        }
    }, [location.state]);

    async function handleSubmit(e) {
        e.preventDefault();
    
        const userData = {
            OIB: OIB,
            firstname: firstName,
            lastname: lastName
        };
    
        try {
            const response = await fetch("https://backend-tyyf.onrender.com/generate-new-ticket", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
    
            if (!response.ok) {
                const res = await response.json();
                alert(res.error);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json(); 
            console.log("res",result);
            localStorage.setItem("userID", result[0].id)

            const response2 = await fetch("https://backend-tyyf.onrender.com/generate-qrcode", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: result[0].id})
            });

            const result2 = await response2.json();
            setQrcodeUrl(result2.qrcodeUrl);
            setLink(result2.link);
    
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <StyledDiv>
            <h1>Complete the form</h1>
            <StyledForm onSubmit={handleSubmit}>
                <StyledInput type="text" name="OIB" value={OIB} placeholder="OIB" onChange={(e) => setOIB(e.target.value)} pattern="\d{11}"/>
                <StyledInput type="text" name="First name" value={firstName} placeholder="Name" onChange={(e) => setFirstName(e.target.value)}/>
                <StyledInput type="text" name="Last name" value={lastName} placeholder="Last name" onChange={(e) => setLastName(e.target.value)}/>
                <StyledButton type="submit">Generate QRcode</StyledButton>
            </StyledForm>
            {qrcodeUrl && <img src={qrcodeUrl} alt="QR Code" style={{padding: "20px"}}/>}
            {link && <a href={link} style={{color: "black"}}>Personal info</a>}
        </StyledDiv>
    )
}

export default Generating;