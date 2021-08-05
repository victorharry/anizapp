import { Router as expressRouter } from 'express';
import Persona from '../models/Persona.js';
import UserPersona from '../models/UserPersona.js';
import UserStatus from '../models/UserStatus.js';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
const router = expressRouter();

router.get('/roulette', async (req, res) => {
    try {
        const personas = await Persona.countDocuments().exec(function (err, count) {

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
        console.error(err)
        return res.status(400).send({ error: 'error' })
    }
})

router.get('/status/:id', async (req, res) => {
    const id = new ObjectId(req.params.id)
    try {
        const userPersona = await UserPersona.findOne({ persona_id: id }).exec()
        return res.status(200).json(userPersona)
    } catch (err) {
        console.error(err)
        return res.status(400).send({ error: 'error' })
    }
})

router.post('/search', async (req, res) => {
    const personaName = new RegExp("^" + req.body.name + "$", "i")
    try {
        const persona = await Persona.findOne({ name: personaName }).exec();
        return res.json(persona)
    } catch (err) {
        console.error(err)
        return res.status(400).send({ error: 'error' })
    }
})

router.post('/marry', async (req, res) => {
    try {
        const marry = await UserPersona.create({ user_id: req.body.user_id, persona_id: new ObjectId(req.body.persona_id) })
        await UserStatus.findOneAndUpdate({ user_id: req.body.user_id }, { marry: false })
        return res.status(201).json(marry)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'error' })
    }
})

router.put('/trade', async (req, res) => {
    try {
        await UserPersona.findOneAndUpdate({ user_id: req.body.sender.id }, { persona_id: new ObjectId(req.body.remittee.persona_id) })
        await UserPersona.findOneAndUpdate({ user_id: req.body.remittee.id }, { persona_id: new ObjectId(req.body.sender.persona_id) })
        return res.status(200).send({ code: 200 })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'error' })
    }
})

export default router;