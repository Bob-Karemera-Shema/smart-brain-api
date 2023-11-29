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
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'test',
        database: 'smart-brain'
    }
});

app.get("/", (req, res) => {
    res.status(200).json('success');
});

app.post("/signin", (req, res) => signin(req, res, database, bcrypt));

app.post("/signup", (req, res) => signup(req, res, database, bcrypt));

app.get("/profile/:id", (req, res) => profile(req, res, database));

app.put("/image", (req, res) => image(req, res, database));

app.post("/imageurl", (req, res) => handleAPICall(req, res));

app.listen(3030, () => {
    console.log("App running on port 3030");
});