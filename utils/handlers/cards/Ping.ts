import type { MainMenu } from "~/utils/game/scenes/MainMenu.js";
import Card from "./Card.js";

export default class Ping extends Card {
  constructor(scene: MainMenu) {
    super(scene);
    this.name = "ping";
    this.playerCardSprite = "cyanPing";
    this.opponentCardSprite = "magentaPing";
  }
}
