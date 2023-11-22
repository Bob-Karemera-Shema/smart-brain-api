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
    res.status(200).json('success');
});

app.post("/signin", (req, res) => {
    database.select('email', 'hash')
        .from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isAuth = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isAuth) {
                database.select('*')
                    .from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'));
            } else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
});

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);

    database.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    });
            })
            .then(trx.commit)
            .catch(trx.rollback)
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
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('User Not Found');
            }
        })
        .catch(err => res.status(400).json('Error getting user'));
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    database('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
});

app.listen(3030, () => {
    console.log("App running on port 3030");
});