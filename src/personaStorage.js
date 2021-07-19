const createPersonaStorage = () => {
    let roulettePersonas = []
    
    function timerToMarry(persona) {
        roulettePersonas.push({ id: persona._id, name: persona.name })
        setTimeout(() => {
            const index = roulettePersonas.findIndex(persona => persona.id == 'persona._id')
            roulettePersonas.splice(index, 1)
        }, 25000);
    }
    
    function removePersona(index) {
        roulettePersonas.splice(index, 1)
    }

    return {
        timerToMarry,
        removePersona,
        roulettePersonas
    }
}

const personaStorage = createPersonaStorage();

export default personaStorage