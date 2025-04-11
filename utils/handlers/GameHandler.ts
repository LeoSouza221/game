import type { GameObjects } from "phaser";

export default class GameHandler {
  gameState = "Initializing";
  isMyTurn = false;
  playerDeck = [];
  opponentDeck = [];
  playerHand: GameObjects.Image[] = [];
  opponentHand: GameObjects.Image[] = [];
  changeTurn: () => void
  changeGameState: (gameState: string) => void

  constructor() {
    this.changeTurn = () => {
      this.isMyTurn = !this.isMyTurn;
      console.log("isMyTurn: " + this.isMyTurn);
    }

    this.changeGameState = (gameState) => {
      this.gameState = gameState;
      console.log("GameState: " + this.gameState);
    }
  }
}
