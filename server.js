import express, { response } from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";

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

database.select()
    .from('users')
    .then(data => {
        console.log(data);
    });

app.get("/", (req, res) => {
    res.send(database.users);
});

app.post("/signin", (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json("error signing in");
    }
});

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    database('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('Unable to sign up'));
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    database
        .select('*')
        .from('users')
        .where({
            id: id
        })
        .then(user => {
            if(user.length){
                res.json(user[0]);
            } else {
                res.status(400).json('User Not Found');
            }
        })
        .catch(err => res.status(400).json('Error getting user'));
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    const found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = !found;
            user.entries += 1;
            console.log(user.entries);
            return res.json(user.entries);
        }
    });

    if (!found) {
        res.status(404).json("User not found");
    }
});

app.listen(3030, () => {
    console.log("App running on port 3030");
});