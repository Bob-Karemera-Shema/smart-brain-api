import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
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
    res.send("Homepage");
});

app.post("/signin", (req, res) => {
    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json("success");
    } else {
        res.status(400).json("error signing in");
    }
});

app.post("signup", (req, res) => {});

app.listen(3000, () => {
    console.log("App running on port 3000");
});