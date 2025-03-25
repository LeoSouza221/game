import CardBack from './cards/Cardback';
// import Boolean from './cards/Boolean';
import Ping from './cards/Ping';
import type { MainMenu } from '../game/scenes/MainMenu';

export default class DeckHandler {
  dealCard: any
  constructor(scene: MainMenu) {
    this.dealCard = (x: number, y: number, name: string, type: string) => {
      const cards = {
        cardBack: new CardBack(scene),
        // boolean: new Boolean(scene),
        ping: new Ping(scene)
      }
      const newCard = cards[name];

      return newCard.render(x, y, type);
    }
  }
}
