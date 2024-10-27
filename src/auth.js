const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const clientSecret = process.env.REACT_APP_AUTH0_CLIENT_SECRET;

const clientIdM2M = process.env.REACT_APP_AUTH0_M2M_CLIENT_ID;
const clientSecretM2M = process.env.REACT_APP_AUTH0_M2M_CLIENT_SECRET;

const getToken = async () => {
    console.log(domain)
    const response = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: `${clientIdM2M}`,  
            client_secret: `${clientSecretM2M}`,  
            audience: "http://localhost:3000",  
        }),
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching access token: ${errorData.error_description}`);
    }

    const data = await response.json();
    return data.access_token;
};

export default getToken;