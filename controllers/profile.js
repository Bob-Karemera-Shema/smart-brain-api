export default function profile(req, res, database) {
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
}