import { Router as expressRouter } from 'express';
import UserStatus from '../models/UserStatus.js';
import User from '../models/User.js';

const router = expressRouter();

router.post('/verify', async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.body.id }).exec()

        if (user) return res.status(200).json(user)

        user = await User.create({ _id: req.body.id, name: req.body.pushname })
        await UserStatus.create({ user_id: user._id })
        return res.status(201).json(user)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'error' })
    }
});

router.get('/status/:id', async (req, res) => {
    const id = req.params.id
    try {
        const user_status = await UserStatus.findOne({ user_id: id })
        return res.status(201).json(user_status)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'error' })
    }
});

router.get('/status/roll/:id', async (req, res) => {
    const id = req.params.id
    try {
        let user_status = await UserStatus.findOne({ user_id: id })
        user_status = await UserStatus.findOneAndUpdate({ user_id: id }, { rolls: user_status.rolls - 1 })
        return res.status(201).json(user_status)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'error' })
    }
});

router.get('/status/marry/:id', async (req, res) => {
    const id = req.params.id
    try {
        const user_status = await UserStatus.findOne({ user_id: id })
        return res.status(201).json(user_status)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'error' })
    }
});

router.get('/reset/rolls', async (req, res) => {
    const id = req.params.id
    try {
        const user_status = await UserStatus.updateMany({}, { rolls: 10 })
        return res.status(201).json(user_status)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'error' })
    }
});

router.get('/reset/marry', async (req, res) => {
    const id = req.params.id
    try {
        const user_status = await UserStatus.updateMany({ marry: true })
        return res.status(201).json(user_status)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'error' })
    }
});

export default router;