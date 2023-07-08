const mongoose = require('mongoose')
const { generateSlug } = require("random-word-slugs")

const userSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true
    },
    uniqueId: {
        type: String,
        required: true,
        default: () => generateSlug(3, { format: "kebab" })
    },
    inviterName: {
        type: String,
        required: true
    },
    inviterUniqueId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 2
    },
    invitations: {
        type: [String],
        required: true
    }

})

module.exports = mongoose.model('user', userSchema)