import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";

const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'your_database_user',
      password : 'your_database_password',
      database : 'myapp_test'
    }
  });
const app = express();
app.use(bodyParser.json());
app.use(cors());
const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Steve",
            email: "steve@gmail.com",
            password: "chocolates",
            entries: 0,
            joined: new Date()
        },
        {
            id: "125",
            name: "Luke",
            email: "luke@gmail.com",
            password: "cheesecakes",
            entries: 0,
            joined: new Date()
        }
    ]
};

app.get("/", (req, res) => {
    res.send(database.users);
});

app.post("/signin", (req, res) => {
    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
    } else {
        res.status(400).json("error signing in");
    }
});

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: "125",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    const found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = !found;
            return res.json(user);
        }
    });

    if(!found) {
        res.status(404).json("User not found");
    }
});

app.put("/image" , (req, res) => {
    const { id } = req.body;
    const found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = !found;
            user.entries += 1;
            console.log(user.entries);
            return res.json(user.entries);
        }
    });

    if(!found) {
        res.status(404).json("User not found");
    }
});

app.listen(3030, () => {
    console.log("App running on port 3030");
});