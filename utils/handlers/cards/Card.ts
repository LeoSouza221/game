import type { MainMenu } from "~/utils/game/scenes/MainMenu";

export default class Card {
  render: (x: number, y: number, type: string) => Phaser.GameObjects.Image
  name: string = ''
  playerCardSprite: string = ''
  opponentCardSprite: string = ''

  constructor(scene: MainMenu) {
    this.render = (x: number, y: number, type: string) => {
      let sprite;
      if (type === 'playerCard') {
        sprite = this.playerCardSprite;
      } else {
        sprite = this.opponentCardSprite;
      }

      const card = scene.add.image(x, y, sprite).setScale(0.5, 0.5).setInteractive().setData({
        "name": this.name,
        "type": type,
        "sprite": sprite,
      });
      // const text = scene.add.text(0, 0, "Some text", {font: "16px Arial", color: '#ffffff' })

      if (type === 'playerCard') {
        scene.input.setDraggable(card);
      }
      return card;
    }
  }
}
