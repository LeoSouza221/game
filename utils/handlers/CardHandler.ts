import type { GameObjects } from "phaser";

export default class CardHandler {
  flipCard: (card) => void

  constructor() {
    this.flipCard = (card: any) => {
      if (card.data.values.type === "playerCard") {
        if (card.texture.key === "cyanCardBack") {
          card.setTexture(card.data.values.sprite);
        } else {
          card.setTexture("cyanCardBack");
        }
      } else if (card.data.values.type === "opponentCard") {
        if (card.texture.key === "magentaCardBack") {
          card.setTexture(card.data.values.sprite);
        } else {
          card.setTexture("magentaCardBack");
        }
      }
    }
  }
}
