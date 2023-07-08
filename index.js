require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
const db = mongoose.connection
db.on('error', error => console.log(error));
db.once('open', () => {console.log('Established Database Connection')})

const User = require('./models/user')
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.post('/users', async (req,res) => {
    try {
        const {name, inviterName, inviterUniqueId } = req.body
        let user = await User.where('uniqueId').equals(inviterUniqueId)
        if (user[0].balance != 0){
            try {
                // Create a new User
                let invitee = await User.create({
                    name,
                    inviterName,
                    inviterUniqueId
                })
        
                // Update the inviter User
                let inviter = await User.findOneAndUpdate(
                    {'uniqueId': inviterUniqueId},
                    { 
                        "$push":  {"invitations": invitee.uniqueId},
                        "$inc": {"balance" : -1}
                    }
                )
        
                // Respond to query
                res.send(invitee)
            } catch (error) {
                res.send('Error: Something Happened')
                console.log(error)
            }
        } else {
            res.send('Your Invite Balance is Zero')
        }
    } catch (error) {
        res.send('Error: Something Happened')
    }

})

app.get('/users/:uniqueId', async (req,res) => {
    const {uniqueId} = req.params
    if (uniqueId != null){
        try {
            let users = await User.where('uniqueId').equals(uniqueId)
            res.json(users[0])
        } catch (error) {
            res.send('Error: Something Happened')
        }
    } else {
        res.send('Bad Request')
    }
	
})

app.get('/stats', async (req,res) => {
    try {
        let users = await User.find({})
        res.json(users.length)
    } catch (error) {
        res.send('Bad Request')
    }
})

app.get('*', function(req, res) {
    res.sendStatus(404)
})

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})
