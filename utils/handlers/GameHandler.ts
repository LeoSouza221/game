export default class GameHandler {
  gameState = "Initializing";
  isMyTurn = false;
  playerDeck = [];
  opponentDeck = [];
  playerHand = [];
  opponentHand = [];
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
