import express, { response } from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";
import signin from "./controllers/signin.js";
import signup from "./controllers/signup.js";
import profile from "./controllers/profile.js";
import {image, handleAPICall} from "./controllers/image.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const database = knex({
    client: 'pg',
    connection: {
        // connectString: process.env.DATABASE_URL,
        // ssl: { rejectUnauthorized: false},
        // host: process.env.DATABASE_HOST,
        // port: 5432,
        // user: process.env.DATABASE_USER,
        // password: process.env.DATABASE_PW,
        // database: process.env.DATABASE_DB
        host: '127.0.0.1',
        user: 'bobsh',
        password: process.env.pglocalpasskey,
        database: 'smart-brain'
    }
});

app.get("/", (req, res) => {
    res.status(200).json('successfully connected to server');
});

app.post("/signin", (req, res) => signin(req, res, database, bcrypt));

app.post("/signup", (req, res) => signup(req, res, database, bcrypt));

app.get("/profile/:id", (req, res) => profile(req, res, database));

app.put("/image", (req, res) => image(req, res, database));

app.post("/imageurl", (req, res) => handleAPICall(req, res));

app.listen(3030, () => {
    console.log(`App running on port 3030`);
});