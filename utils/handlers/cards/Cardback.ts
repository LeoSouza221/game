import type { MainMenu } from "~/utils/game/scenes/MainMenu.js";
import Card from "./Card.js";

export default class CardBack extends Card {
  constructor(scene: MainMenu) {
    super(scene);
    this.name = "cardBack";
    this.playerCardSprite = "cyanCardBack";
    this.opponentCardSprite = "magentaCardBack";
  }
}
