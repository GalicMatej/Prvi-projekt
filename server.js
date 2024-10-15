const express = require("express")
const cors = require("cors")
const {query} = require("./db")
const QRCode = require('qrcode');
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
const jwksClient = require("jwks-rsa");

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const clientSecret = process.env.REACT_APP_AUTH0_CLIENT_SECRET;

const corsOptions = {
    origin: 'http://localhost:3001', // Replace with your frontend URL
    optionsSuccessStatus: 200
};

const app = express()
app.use(express.json());
app.use(cors(corsOptions));

const client = jwksClient({
    jwksUri: 'https://dev-iuycdx4u3t0yxzb5.eu.auth0.com/.well-known/jwks.json'  // Auth0 JWKS URI
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
        audience: "http://localhost:3000",  // Replace with your API audience from Auth0
        issuer: 'https://dev-iuycdx4u3t0yxzb5.eu.auth0.com/',  // Your Auth0 domain
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
    // console.log(id);

    const qrcodetemp = `http://localhost:3001/user/${id}`; 
    // PRAVI KOJI RADI
    // const qrcodetemp = "http://localhost:3001/callback";

    const qrcodeUrl = await QRCode.toDataURL(qrcodetemp);
    // console.log(qrcodeUrl);
    res.json({qrcodeUrl});
})

app.post("/get-token", async (req, res) => {
    try {
        const token = await getAccessToken();
        res.json({ access_token: token });
    } catch (error) {
        res.status(500).send("Error fetching access token");
    }
})

app.get("/get-user-data", async (req, res) => {
    const id = req.query.id;
    console.log(id)
    const getUserData = `SELECT * FROM PUBLIC.USERS WHERE ID = $1`;

    const result = await query(getUserData, [id]);
    if(result == null) {
        return res.status(404).json({ error: "User not found" });
    }

    // console.log(result)
    res.send(result);
})

app.listen(3000, () => {
    console.log("Server is running on port 3000!")
})

// export default getAccessToken