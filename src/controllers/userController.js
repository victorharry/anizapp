const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/verify', async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.body.id }).exec()

        if(user) return res.status(200).send({ message: 'User found' })

        await User.create({phone: req.body.id, name: req.body.pushname})

        return res.status(201).send({ message: 'User created' })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: 'error' })
    }
});

module.exports = app => app.use('/user', router)