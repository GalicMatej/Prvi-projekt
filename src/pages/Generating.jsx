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
    margin-bottom: 15px; /* Space between input fields */
    padding: 15px; /* Padding inside input */
    border: 1px solid #ccc; /* Border for input */
    border-radius: 4px; /* Rounded corners */
    font-size: 16px; /* Font size for input text */
`;

const StyledButton = styled.button`
    background-color: purple;
    border: none;
    border-radius: 10%;
    font-size: 1.5rem;
    /* padding: 1rem 1.5rem; */
    text-align: center;
`;


function Generating() {
    // const [value, setValue] = useState("");
    const [OIB, setOIB] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [qrcodeUrl, setQrcodeUrl] = useState("");
    const [link, setLink] = useState(null);
    const [token, setToken] = useState(null);

    const location = useLocation();
    // const token = location.state?.data;
    // setToken(location.state?.data);

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

//    useEffect(() => {
//         // Provjerite je li token poslan u `state`
//         if (location.state && location.state.data) {
//             token = location.state.data;
//             console.log("Token received:", token);
//             // Nastavite s obradom tokena
//         } else {
//             console.log("Token not found, redirecting...");
//         }
//     }, [location]);

    async function handleSubmit(e) {
        e.preventDefault();
    
        const userData = {
            OIB: OIB,
            firstname: firstName,
            lastname: lastName
        };
    
        try {
            const response = await fetch("https://backend-tyyf.onrender.com/generate-new-user", {
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
            // console.log(result2.qrcodeUrl);
    
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
            {/* {qrcodeUrl && (
                <Link to={qrcodeUrl}>
                    <img src={qrcodeUrl} alt="QR Code" style={{padding: "20px"}}/>
                </Link>)} */}
            {qrcodeUrl && <img src={qrcodeUrl} alt="QR Code" style={{padding: "20px"}}/>}
            {link && <a href={link} style={{color: "black"}}>Personal info</a>}
        </StyledDiv>
    )
}

export default Generating;