const express = require('express');

const Persona = require('../models/Persona');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const personas = await Persona.count().exec(function (err, count) {

            // Get a random entry
            var random = Math.floor(Math.random() * count)

            // Again query all personas but only fetch one offset by our random #
            Persona.findOne().skip(random).exec(
                function (err, result) {
                    //random persona
                    return res.json(result)
                })
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'error' })
    }
});

module.exports = app => app.use('/roulette', router)