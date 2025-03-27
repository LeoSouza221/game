import type { GameObjects, Input } from 'phaser'
import { Scene } from 'phaser'
import { EventBus } from '../EventBus'
import { UiHandler } from '~/utils/handlers/UiHandler'
import InteractiveHandler from '~/utils/handlers/InteractiveHandler'
import GameHandler from '~/utils/handlers/GameHandler'

export class MainMenu extends Scene {
  background?: GameObjects.Image
  text?: GameObjects.Text
  gameOptions = {
    startingCards: 6,
    cardWidth: 265,
    cardHeight: 400,
    handSizeRatio: 0.25,
    boardSizeRatio: 0.3
  }
  boardGroup: GameObjects.Group
  handGroup: GameObjects.Group
  cardPreview?: GameObjects.Sprite
  zone: GameObjects.Zone
  zones: Array<{ zone: GameObjects.Zone }>
  UIHandler: UiHandler
  InteractiveHandler: InteractiveHandler
  GameHandler: GameHandler
  constructor() {
    super('MainMenu')
  }

  preload() {
    this.load.image('star', 'assets/star.png')
    this.load.atlas('cards', 'assets/cards.png', 'assets/cards.json');
  }

  create() {
    this.zones = []

    this.UIHandler = new UiHandler(this);
    this.UIHandler.buildUI(5);
    // this.CardHandler = new CardHandler();
    // this.DeckHandler = new DeckHandler(this);
    this.GameHandler = new GameHandler();
    // this.SocketHandler = new SocketHandler(this);
    this.InteractiveHandler = new InteractiveHandler(this);

    // // group containing cards on board
    this.boardGroup = this.add.group();
    // // group containing cards in hand
    this.handGroup = this.add.group();

    for (let i = 0; i < this.gameOptions.startingCards; i++) {
      const playerName = 'player1'
      this.createCard(i, playerName);
    }

    EventBus.emit('current-scene-ready', this)
  }

  getWidth() {
    let width = 0

    if (typeof this.game.config.width === 'string') {
      width = Number.parseInt(this.game.config.width)
    }
    else {
      width = this.game.config.width
    }

    return width
  }

  getHeight() {
    let height = 0

    if (typeof this.game.config.height === 'string') {
      height = Number.parseInt(this.game.config.height)
    }
    else {
      height = this.game.config.height
    }

    return height
  }

  createCardPreview() {
    this.cardPreview = this.add.sprite(0, 0, "cards");
    this.cardPreview.visible = false;
    this.cardPreview.alpha = 0.25;
    this.cardPreview.displayWidth = this.gameOptions.cardWidth * this.gameOptions.boardSizeRatio;
    this.cardPreview.displayHeight = this.gameOptions.cardHeight * this.gameOptions.boardSizeRatio;
    this.cardPreview.setOrigin(0.5, 0.0);
  }


  createCard(n: number, name: string) {
    const coordinates = this.setHandCoordinates(n, this.gameOptions.startingCards);
    const frames = this.textures.get('cards').getFrameNames();
    const card = this.add.sprite(coordinates.x, coordinates.y, "cards", Phaser.Math.RND.pick(frames)).setInteractive();

    card.name = name
    card.setInteractive({
      draggable: true
    });
    this.input.setDraggable(card);

    card.setOrigin(0.5, 1);

    if (this.handGroup) {
      this.handGroup.add(card);
    }
  }

  setHandCoordinates(n: number, totalCards: number) {
    const width = this.getWidth()
    const height = this.getHeight()
    const teste = (totalCards - 1) * 0.5

    const rotation = 0
    const xPosition = width / 2 - (140 * (n - teste) / 2);
    const yPosition = height - 100;
    return {
      x: xPosition,
      y: yPosition,
      r: rotation
    }
  }

  // method to arrange cards in hand
  arrangeCardsInHand() {
    this.handGroup.children.iterate((card, i): boolean => {
      card.setDepth(i);
      const coordinates = this.setHandCoordinates(i, this.handGroup.countActive());
      this.tweens.add({
        targets: card,
        rotation: coordinates.r,
        x: coordinates.x,
        y: coordinates.y,
        // displayWidth: this.gameOptions.cardWidth / 2,
        // displayHeight: this.gameOptions.cardHeight / 2,
        duration: 150
      });

      return true
    }, this);
  }

  setPreviewCoordinates(n: number, totalCards: number) {
    return {
      x: this.getWidth() / 2 - (totalCards - 1) * this.gameOptions.cardWidth * this.gameOptions.boardSizeRatio * 0.6 + n * this.gameOptions.cardWidth * this.gameOptions.boardSizeRatio * 1.2,
      y: 700
    }
  }
}
