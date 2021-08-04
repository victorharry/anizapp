import express from 'express'
import router from '../routes/index.js'
import WhatsappConnection from '../whatsapp/connection.js'
import '../schedules.js'

const app = express();
const port = 3000;

app.use(express.json());
WhatsappConnection();

app.use(router)

app.listen(port, () => {
    console.log(`Anizapp listening at http://localhost:${port} 🇯🇵`);
});