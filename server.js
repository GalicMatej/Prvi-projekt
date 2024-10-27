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
//     origin: ['https://frontend-6ih3.onrender.com'],
//     optionsSuccessStatus: 200
// };

const corsOptions = {
    origin: 'https://frontend-6ih3.onrender.com',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express()
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'build')));

const client = jwksClient({
    jwksUri: `https://${domain}/.well-known/jwks.json`
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

function checkJwt(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, {
        audience: "https://backend-tyyf.onrender.com",
        issuer: `https://${domain}/`, 
        algorithms: ['RS256']
    }, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid or expired token' });
        }
        
        req.user = decoded;
        next();
    });
}

app.get("/", (req, res) => {
    res.status(200).send("Start");
});

app.get('/get-all-users', checkJwt, async (req, res) => {
    const countAll = `SELECT COUNT (*) from public.database;`;

    const result = await query(countAll, []);
        
    res.send(result);
});

app.post("/generate-new-ticket", checkJwt, async (req, res) => {
    const {OIB, firstname, lastname} = req.body;

    if(OIB === '' || firstname === '' || lastname === '') {
        return res.status(400).send({error: "All of the fields must be filled!!!"});
    }

    const selectUser = `SELECT * FROM public.database WHERE OIB = $1;`;
    const temp = await query(selectUser, [OIB]);

    if(temp.length == 3) {
        return res.status(400).send({error: "There are already 3 tickets assigned to this OIB!!!"});
    }

    const insertUser = `INSERT INTO public.database (OIB, first_name, last_name)
                        VALUES ($1, $2, $3)
                        RETURNING *;`;

    const values = [OIB, firstname, lastname];

    const result = await query(insertUser, values);
    res.send(result);
});

app.post("/generate-qrcode", async (req, res) => {
    const {id} = req.body;
    const link = `https://frontend-6ih3.onrender.com/user/${id}`;

    const qrcodetemp = `https://frontend-6ih3.onrender.com/user/${id}`; 

    const qrcodeUrl = await QRCode.toDataURL(qrcodetemp);
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
            client_id: `${clientIdM2M}`,
            client_secret: `${clientSecretM2M}`,
            audience: process.env.AUDIENCE,
        }),
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching access token: ${errorData.error_description}`);
    }

    const data = await response.json();
    res.send(data)
})

app.get("/get-user-data", async (req, res) => {
    const id = req.query.id;
    const getUserData = `SELECT * FROM PUBLIC.database WHERE ID = $1`;

    const result = await query(getUserData, [id]);
    if(result == null) {
        return res.status(404).json({ error: "User not found" });
    }

    res.send(result);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}!`)
})