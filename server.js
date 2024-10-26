const express = require("express")
const cors = require("cors")
const {query} = require("./db")
const QRCode = require('qrcode');
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
const jwksClient = require("jwks-rsa");
const path = require("path");
const { lchown } = require("fs");
require('dotenv').config();

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const clientSecret = process.env.REACT_APP_AUTH0_CLIENT_SECRET;
const clientIdM2M = process.env.REACT_APP_AUTH0_M2M_CLIENT_ID;
const clientSecretM2M = process.env.REACT_APP_AUTH0_M2M_CLIENT_SECRET;
const port = process.env.PORT || 3000;

// const corsOptions = {
//     origin: ['https://frontend-6ih3.onrender.com'], // Replace with your frontend URL
//     optionsSuccessStatus: 200
// };

const corsOptions = {
    origin: 'https://frontend-6ih3.onrender.com',
    methods: ['GET', 'POST', 'OPTIONS'], // Add any other methods you need
    allowedHeaders: ['Content-Type', 'Authorization'], // Add necessary headers
};

const app = express()
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'build')));

const client = jwksClient({
    jwksUri: `https://${domain}/.well-known/jwks.json`  // Auth0 JWKS URI
});

// Function to retrieve signing key from Auth0
function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

// Middleware to validate the JWT token
function checkJwt(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];  // Extract the token from the header
    // console.log("TOKEN", token);

    // Verify the JWT
    jwt.verify(token, getKey, {
        audience: "https://backend-tyyf.onrender.com",  // Replace with your API audience from Auth0
        issuer: `https://${domain}/`,  // Your Auth0 domain
        algorithms: ['RS256']
    }, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid or expired token' });
        }
        
        // If token is valid, save the decoded token info and proceed
        req.user = decoded;
        // console.log("GOOD");
        next();  // Proceed to the next middleware or route handler
    });
}

app.get("/", (req, res) => {
    res.status(200).send("Start");
});

app.get('/get-all-users', checkJwt, async (req, res) => {
    const countAll = `SELECT COUNT (*) from public.users;`;

    const result = await query(countAll, []);
        
    res.send(result);
});

app.post("/generate-new-user", checkJwt, async (req, res) => {
    const {OIB, firstname, lastname} = req.body;

    if(OIB === '' || firstname === '' || lastname === '') {
        return res.status(400).send({error: "All of the fields must be filled!!!"});
    }

    const selectUser = `SELECT * FROM public.users WHERE OIB = $1;`;
    const temp = await query(selectUser, [OIB]);
    // console.log("temp: ", temp);

    if(temp.length == 3) {
        return res.status(400).send({error: "There are already 3 tickets assigned to this OIB!!!"});
    }

    // Insert the new user into the database
    const insertUser = `INSERT INTO public.users (OIB, first_name, last_name)
                        VALUES ($1, $2, $3)
                        RETURNING *;`;

    const values = [OIB, firstname, lastname];

    const result = await query(insertUser, values);
    res.send(result);
});

app.post("/generate-qrcode", async (req, res) => {
    const {id} = req.body;
    const link = `https://frontend-6ih3.onrender.com/user/${id}`;
    // console.log(id);

    // const qrcodetemp = `https://frontend-6ih3.onrender.com/callback`;
    const qrcodetemp = `https://frontend-6ih3.onrender.com/user/${id}`; 
    // PRAVI KOJI RADI
    // const qrcodetemp = `http://localhost:3001/user/${id}`;

    const qrcodeUrl = await QRCode.toDataURL(qrcodetemp);
    // console.log(qrcodeUrl);
    res.json({qrcodeUrl: qrcodeUrl, link: link});
})

app.get("/get-token", async (req, res) => {
    const response = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: `${clientIdM2M}`,  // ID tvoje M2M aplikacije
            client_secret: `${clientSecretM2M}`,  // Tajni ključ tvoje M2M aplikacije
            audience: process.env.AUDIENCE,  // Identifikator API-ja
        }),
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching access token: ${errorData.error_description}`);
    }

    const data = await response.json();
    console.log("data:", data)
    res.send(data)
})

app.get("/get-user-data", async (req, res) => {
    const id = req.query.id;
    // console.log(id)
    const getUserData = `SELECT * FROM PUBLIC.USERS WHERE ID = $1`;

    const result = await query(getUserData, [id]);
    if(result == null) {
        return res.status(404).json({ error: "User not found" });
    }

    // console.log(result)
    res.send(result);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}!`)
})