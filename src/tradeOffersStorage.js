const createTradeOffersStorage = () => {
    let tradeOffers = []

    function timerToTrade(sender, persona, remittee, confirm = false) {
        tradeOffers.push({ sender_id: sender, persona_id: persona, remittee_id: remittee, confirm })
        setTimeout(() => {
            const index = tradeOffers.findIndex(offer => offer.sender_id == sender)
            tradeOffers.splice(index, 1)
        }, 25000);
    }

    function removeOffer(index) {
        tradeOffers.splice(index, 1)
    }

    return {
        timerToTrade,
        removeOffer,
        tradeOffers
    }
}

const tradeOffersStorage = createTradeOffersStorage();

export default tradeOffersStorage