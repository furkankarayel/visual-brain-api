const checkUserPassword = (enteredPassword, storedPasswordHash, bcrypt) =>  
    bcrypt.compare(enteredPassword, storedPasswordHash)

const handleLogin = (db, bcrypt) => (req,res) => {
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json('incorrect form submission')
    }
    if(email && password != null) {
        db('login')
        .where('email', email)
        .then(response => {
            var data = response[0]

            if(checkUserPassword(password, data.hash, bcrypt))
                {
                    console.log('yea')
                    db('users')
                        .select('*')
                        .where('email', email)
                        .then(user => {
             
                            res.json(user[0])
                        })
                        .catch(err => res.status(400).json('not able to get user'))
                    
                } 
        })
        .catch(err => res.status(400).json('wrong credentials'))
    } else {
        res.status(400).json('wrong credentials')
    }
}

module.exports = {
    handleLogin: handleLogin
}