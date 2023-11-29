export default function signin(req, res, database, bcrypt) {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json('incorrect form submission');
    database.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const isAuth = bcrypt.compareSync(password, data[0].hash);
            if (isAuth) {
                database.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'));
            } else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
}