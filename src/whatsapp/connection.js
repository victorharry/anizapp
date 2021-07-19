import venom from 'venom-bot'
import events from './events.js'
import { setClient } from './message.js'

const connection = async () => {
    try {
        const client = await venom.create(
            {
                folderNameToken: 'tokens',
                disableWelcome: false,
            },
        )
        events(client) // Pensar em uma forma melhor, estilo Redux
        setClient(client) // Pensar em uma forma melhor, estilo Redux
    } catch (error) {
        console.error(error)
    }
}

export default connection