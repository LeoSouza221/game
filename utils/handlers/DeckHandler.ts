import CardBack from './cards/Cardback';
// import Boolean from './cards/Boolean';
import Ping from './cards/Ping';
import type { MainMenu } from '../game/scenes/MainMenu';
import type { GameObjects } from 'phaser';
import type Card from './cards/Card';

export default class DeckHandler {
  dealCard: (position: number, name: string, type: string) => GameObjects.Image
  constructor(scene: MainMenu) {

    this.dealCard = (position: number, name: string, type: string) => {
      const cards: { cardBack: Card, ping: Card } = {
        cardBack: new CardBack(scene),
        // boolean: new Boolean(scene),
        ping: new Ping(scene)
      }
      const newCard: Card = cards[name];
      const width = scene.getWidth()
      const height = scene.getHeight()
      const coordinates = this.setHandCoordinates(position, scene.gameOptions.startingCards, width, height);
      // newCard.setOrigin(0.5, 1);
      return newCard.render(coordinates.x, coordinates.y, type);
    }
  }

  setHandCoordinates(n: number, totalCards: number, width: number, height: number) {
    const teste = (totalCards - 1) * 0.5

    const rotation = 0
    const xPosition = width / 2 - (140 * (n - teste) / 2);
    const yPosition = height - 200;
    return {
      x: xPosition,
      y: yPosition,
      r: rotation
    }
  }
  // createCard(n: number, name: string) {
  //   const coordinates = this.setHandCoordinates(n, this.gameOptions.startingCards);
  //   const frames = this.textures.get('cards').getFrameNames();
  //   const card = this.add.sprite(coordinates.x, coordinates.y, "cards", Phaser.Math.RND.pick(frames)).setInteractive();

  //   card.name = name
  //   card.setInteractive({
  //     draggable: true
  //   });
  //   this.input.setDraggable(card);

  //   card.setOrigin(0.5, 1);

  //   if (this.handGroup) {
  //     this.handGroup.add(card);
  //   }
  // }
}
