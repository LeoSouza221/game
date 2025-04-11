import io from 'socket.io-client';
import type { MainMenu } from '../game/scenes/MainMenu';

export default class SocketHandler {
  constructor(scene: MainMenu) {

    scene.socket = io('http://localhost:8080');

    scene.socket.on('connect', () => {
      console.log('Connected!');
      scene.socket.emit('dealDeck', scene.socket.id);
    });

    scene.socket.on('firstTurn', () => {
      scene.GameHandler.changeTurn();
    })

    scene.socket.on('changeGameState', (gameState) => {
      scene.GameHandler.changeGameState(gameState);
      if (gameState === "Initializing") {
        scene.socket.emit("dealCards", scene.socket.id);
      }
    });

    scene.socket.on('changeTurn', () => {
      scene.GameHandler.changeTurn();
    })


    scene.socket.on('dealCards', (socketId, cards) => {
      console.log(cards)
      if (socketId === scene.socket.id) {
        for (let i = 0; i <= cards; i++) {
          scene.GameHandler.playerHand.push(scene.DeckHandler.dealCard(i, cards[i], "playerCard"));
        }
      } else {
        for (let i = 0; i <= cards; i++) {
          scene.GameHandler.opponentHand.push(scene.DeckHandler.dealCard(i, "cardBack", "opponentCard"));
        }
      }
    })

    scene.socket.on('cardPlayed', (cardName, socketId) => {
      if (socketId !== scene.socket.id) {
        scene.GameHandler.opponentHand.shift().destroy();
        scene.DeckHandler.dealCard((scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 50), scene.dropZone.y, cardName, "opponentCard");
        scene.dropZone.data.values.cards++;
      }
    })

  }
}
