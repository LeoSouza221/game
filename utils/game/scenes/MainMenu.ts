import type { GameObjects, Input } from 'phaser'
import { Scene } from 'phaser'
import { EventBus } from '../EventBus'
import { UiHandler } from '~/utils/handlers/UiHandler'

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
  boardGroup?: GameObjects.Group
  handGroup: GameObjects.Group
  cardPreview?: GameObjects.Sprite
  zone: GameObjects.Zone
  zones: Array<{ zone: GameObjects.Zone }>
  UIHandler: UiHandler

  constructor() {
    super('MainMenu')
  }

  preload() {
    this.load.image('star', 'assets/star.png')
    // this.load.spritesheet('cards', 'assets/cards.png', {
    //   frameWidth: this.gameOptions.cardWidth,
    //   frameHeight: this.gameOptions.cardHeight
    // });
    this.load.atlas('cards', 'assets/cards.png', 'assets/cards.json');
  }

  create() {
    this.zones = []

    this.UIHandler = new UiHandler(this);
    this.UIHandler.buildUI(5);


    // // group containing cards on board
    this.boardGroup = this.add.group();

    // // group containing cards in hand
    this.handGroup = this.add.group();
    // // game background
    // // this.background = this.add.sprite(game.config.width / 2, game.config.height / 2, "background");

    // // creation of card preview sprite
    // this.createCardPreview();

    // // set a drop zone
    // this.zone = this.add.zone(650, 460, 800, 400);
    // this.zone.setRectangleDropZone(800, 400);

    // const graphics = this.add.graphics();
    // graphics.lineStyle(2, 0xffff00);
    // graphics.strokeRect(this.zone.x - this.zone.input.hitArea.width / 2, this.zone.y - this.zone.input.hitArea.height / 2, this.zone.input.hitArea.width, this.zone.input.hitArea.height);
    for (let i = 0; i < this.gameOptions.startingCards; i++) {
      const playerName = 'player1'
      this.createCard(i, playerName);
    }

    // listener fired when we start dragging
    this.input.on("dragstart", (pointer: Input.Pointer, card: GameObjects.Group) => {

      // is the card in hand?
      if (this.handGroup.contains(card)) {
        console.log('aqui')

        // remove card from hand
        this.handGroup.remove(card);
        this.children.bringToTop(card);

        // re-arrange cards in hand
        this.arrangeCardsInHand();

        // bring the card in front
        card.setDepth(this.handGroup.countActive());

        // set card preview frame to match dragged card frame
        // this.cardPreview.setFrame(card.frame.name);

        // tween to animate the card
        // this.tweens.add({
        //   targets: card,
        //   angle: 0,
        //   x: pointer.x,
        //   y: pointer.y,
        //   displayWidth: this.gameOptions.cardWidth,
        //   displayHeight: this.gameOptions.cardHeight,
        //   duration: 150
        // });
      };
    });

    this.input.on("drag", (pointer: Input.Pointer, card: GameObjects.GameObject, dragX, dragY) => {

      // if the card is not in hand and not on the board...
      if (this.handGroup && !this.handGroup.contains(card) && this.boardGroup && !this.boardGroup.contains(card)) {
        // move the card to pointer position
        console.log('aqui 2')
        card.x = dragX
        card.y = dragY
      }
    });

    // listener fired when we are dragging and the input enters the drop zone
    this.input.on("dragenter", (pointer, gameObject, dropZone) => {
      // show card preview
      // this.cardPreview.visible = true;

      // arrange cards on board
      // this.arrangeCardsOnBoard(true);
      const zonePosition = Number.parseInt(dropZone.name)

      if (zonePosition >= 0) {
        if (zonePosition < 5 && gameObject.name === 'player1' || zonePosition >= 5 && gameObject.name === 'player2') {
          this.changeDropzoneColor(0x11ff00, zonePosition)

          return
        }
        this.changeDropzoneColor(0xff3300, zonePosition)

      }




    });

    // listener fired when we are dragging and the input leaves the drop zone
    this.input.on("dragleave", (pointer, gameObject, dropZone) => {

      // hide card preview
      // this.cardPreview.visible = false;

      // arrange cards on board
      // this.arrangeCardsOnBoard(false);
      const zonePosition = Number.parseInt(dropZone.name)

      if (zonePosition >= 0) {
        this.changeDropzoneColor(0xffffff, zonePosition)

      }
    });

    this.input.on("drop", (pointer, card, dropZone) => {
      const zonePosition = Number.parseInt(dropZone.name)

      if (zonePosition >= 5 && card.name === 'player1' || zonePosition < 5 && card.name === 'player2') {
        this.handGroup.add(card);

        card.x = card.input.dragStartX;
        card.y = card.input.dragStartY;
        // arrange cards in hand
        this.arrangeCardsInHand();
        return
      }

      card.x = dropZone.x;
      card.y = dropZone.y + 100;

      card.input.enabled = false;

      if (zonePosition >= 0) {
        this.changeDropzoneColor(0xffff00, zonePosition)
      }

      if (dropZone.input) dropZone.input.dropZone = false
    });


    // listener fired when we stop dragging
    this.input.on("dragend", (pointer, card, dropped) => {
      if (!this.handGroup.contains(card) && !this.boardGroup.contains(card)) {
        // hide card preview
        // this.cardPreview.visible = false;

        // if the card hasn't been dropped in the drop zone...

        if (!dropped) {
          // add dragged card to hand group
          this.handGroup.add(card);

          card.x = card.input.dragStartX;
          card.y = card.input.dragStartY;
          // arrange cards in hand
          this.arrangeCardsInHand();
        }
      }
    });


    // const frames = this.textures.get('cards').getFrameNames();
    // console.log(this.getWidth())
    // let i = 0
    // const target = 6
    // let x = this.getWidth() / 2 - (100 * (target - 1) / 2);
    // const y = this.getHeight() - 200;

    // for (i; i < target; i++) {
    //   const image = this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive();

    //   this.input.setDraggable(image);

    //   x += 100;
    // }

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

  // method to arrange cards on board
  // preview = true if we have to show card preview
  arrangeCardsOnBoard(preview) {

    // determine the amount of cards on board, preview included
    const cardsOnBoard = this.boardGroup.countActive() + (preview ? 1 : 0);

    // set position of the cards on board
    this.boardGroup.children.iterate(function (card, i) {
      const coordinates = this.setPreviewCoordinates(i, cardsOnBoard);
      card.x = coordinates.x;
      card.y = coordinates.y;
    }, this);

    // set the position of card preview, if any
    // if (preview) {
    //   const cardPreviewPosition = this.setPreviewCoordinates(cardsOnBoard - 1, cardsOnBoard);
    //   this.cardPreview.x = cardPreviewPosition.x;
    //   this.cardPreview.y = cardPreviewPosition.y;
    // }


  }

  changeDropzoneColor(color: number, zonePosition: number) {
    if (this.zones && this.zones[zonePosition]) {
      // this.zones[zonePosition].graphic.clear();
      // this.zones[zonePosition].graphic.lineStyle(2, color);
      // this.zones[zonePosition]
      //   .graphic
      //   .strokeRect(
      //     this.zones[zonePosition].zone.x - this.zones[zonePosition]?.zone?.input?.hitArea.width / 2,
      //     this.zones[zonePosition].zone.y - this.zones[zonePosition]?.zone?.input?.hitArea?.height / 2,
      //     this.zones[zonePosition]?.zone?.input?.hitArea.width,
      //     this.zones[zonePosition]?.zone?.input?.hitArea.height
      //   )
    }
  }
}
