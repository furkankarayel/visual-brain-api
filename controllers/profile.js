const handleProfileGet = (db) => (req,res) => {
    const { id } = req.params;
    db('users')
        .select('name','email','entries','join_date')
        .where('id', id)
        .then(userData => {
            if(userData.length) {
                var user = userData[0]
                res.json(user)
            } else {
                res.status(400).json('not found')
            }
           
        })
}

module.exports = {
    handleProfileGet: handleProfileGet
}