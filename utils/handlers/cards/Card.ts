import type { MainMenu } from "~/utils/game/scenes/MainMenu";

export default class Card {
  render: any
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
      const card = scene.add.image(x, y, sprite).setScale(0.25, 0.25).setInteractive().setData({
        "name": this.name,
        "type": type,
        "sprite": sprite
      });
      if (type === 'playerCard') {
        scene.input.setDraggable(card);
      }
      return card;
    }
  }
}
