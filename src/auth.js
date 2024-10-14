const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const clientSecret = process.env.REACT_APP_AUTH0_CLIENT_SECRET;

const clientIdM2M = process.env.REACT_APP_AUTH0_M2M_CLIENT_ID;
const clientSecretM2M = process.env.REACT_APP_AUTH0_M2M_CLIENT_SECRET;

const getToken = async () => {
    const response = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: `${clientIdM2M}`,  // ID tvoje M2M aplikacije
            client_secret: `${clientSecretM2M}`,  // Tajni ključ tvoje M2M aplikacije
            audience: "http://localhost:3000",  // Identifikator API-ja
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

// var request = require("request");

// var options = { method: 'POST',
//   url: 'https://dev-iuycdx4u3t0yxzb5.eu.auth0.com/oauth/token',
//   headers: { 'content-type': 'application/json' },
//   body: JSON.stringify({ 
//     client_id:"WgqdiAqNgllK4rh38ZpwgcKshlalKM8y",
//     client_secret:"SyjY5d4_CMmZxtZ_DvNCSxbza7SJF21-_VufPpD51Z489dCbZ6sZfEBK9dy1Ihn3",
//     audience:"https://dev-iuycdx4u3t0yxzb5.eu.auth0.com/api/v2/",
//     grant_type:"client_credentials"}) };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });