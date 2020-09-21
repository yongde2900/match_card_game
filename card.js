const GAME_STATE = {
    FirstCardAwait: 'FirstCardAwait',
    SecondCardAwiat: 'SecondCardAwait',
    CardMatchedFailed: 'CardMatchedFailed',
    CardMatched: 'CardMatched',
    GameFinished: 'GameFinished'
}
const Symbol = ['https://image.flaticon.com/icons/svg/105/105223.svg', //黑桃
    'https://image.flaticon.com/icons/svg/105/105220.svg', //紅心
    'https://image.flaticon.com/icons/svg/105/105212.svg', //方塊
    'https://image.flaticon.com/icons/svg/105/105219.svg' //梅花
]
const model = {
    revealdCards: [],
    isRevealCardsMatched() {
        return this.revealdCards[0].dataset.index % 13 === this.revealdCards[1].dataset.index % 13
    }
}
const view = {
    getCardElement(index) {
        return `<div class="card back" data-index="${index}"></div>`
    },
    getCardContent(index) {
        const number = this.transformNumber((index % 13) + 1)
        const symbol = Symbol[Math.floor(index / 13)]
        return `
          <p>${number}</p>
          <img src="${symbol}" />
          <p>${number}</p>
        `
    },
    transformNumber(number) {
        switch (number) {
            case 1:
                return 'A'
            case 11:
                return 'J'
            case 12:
                return 'Q'
            case 13:
                return 'K'
            default:
                return number
        }
    },
    displayCards() {
        const rootElement = document.querySelector('#cards')
        rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join("")
    },
    flipCards(...cards) {
        cards.map(card => {
            if (card.classList.contains('back')) {
                card.classList.remove('back')
                card.innerHTML = view.getCardContent(Number(card.dataset.index))
                return
            }
            card.classList.add('back')
            card.innerHTML = null
        })
    },
    pairCards(...cards) {
        cards.map(card => {
            card.classList.add('paired')
        })
    }
}
const controller = {
    currentState: GAME_STATE.FirstCardAwait,
    generateCards() {
        view.displayCards()
    },
    resetCards(){
        view.flipCards(...model.revealdCards)
        model.revealdCards = []
        controller.currentState = GAME_STATE.FirstCardAwait
    },
    dispatchCardsAction(card) {
        if (!card.classList.contains('back')) {
            return
        }
        switch (this.currentState) {
            case GAME_STATE.FirstCardAwait:
                view.flipCards(card)
                model.revealdCards.push(card)
                this.currentState = GAME_STATE.SecondCardAwiat
                break
            case GAME_STATE.SecondCardAwiat:
                view.flipCards(card)
                model.revealdCards.push(card)
                //判斷
                if (model.isRevealCardsMatched()) {
                    this.currentState = GAME_STATE.CardMatched
                    view.pairCards(...model.revealdCards)
                    model.revealdCards = []
                    this.currentState = GAME_STATE.FirstCardAwait
                }
                else {
                    this.currentState = GAME_STATE.CardMatchedFailed
                    setTimeout(() => this.resetCards(), 1000)
                }
                break
        }
    }
}
const utility = {
    getRandomNumberArray(count) {
        const number = Array.from(Array(52).keys())
        for (let index = number.length - 1; index > 0; index--) {
            let randomIndex = Math.floor(Math.random() * (index + 1));
            [number[index], number[randomIndex]] = [number[randomIndex], number[index]]
        }
        return number
    }
}
controller.generateCards()
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', event => {
        controller.dispatchCardsAction(card)
    })
})