const handleRegister = (db, bcrypt) => (req,res) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password){
        return res.status(400).json('incorrect form submission')
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.transaction(tx => {
        tx.insert({
            hash: hashedPassword,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
           return tx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    join_date: new Date()
                })
                .then(newUser => {
                res.json(newUser[0])
                })
        })
        .then(tx.commit)
        .catch(tx.rollback)
    })
    .catch(err => res.status(400).json('registration failed'))
}

module.exports = {
    handleRegister: handleRegister
}