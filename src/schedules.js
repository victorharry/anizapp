import schedule from 'node-schedule'
import axios from 'axios'

// Reset rolls timer
const rolls_timer = schedule.scheduleJob('*/30 * * * *', async () => {
    try {
        await axios.get('http://localhost:3000/user/reset/rolls')
    } catch (err) {
        console.error(err)
    }
});

// Reset marry timer
const marry_timer = schedule.scheduleJob('0 * * * *', async () => {
    try {
        await axios.get('http://localhost:3000/user/reset/marry')
    } catch (err) {
        console.error(err)
    }
});