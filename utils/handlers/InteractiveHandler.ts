import type { Game, GameObjects, Input } from "phaser";
import type { MainMenu } from "../game/scenes/MainMenu";

export default class InteractiveHandler {
  game: Game
  localScene: MainMenu
  constructor(scene: MainMenu) {

    scene.cardPreview = undefined;
    this.localScene = scene
    this.game = scene.game
    // scene.dealCards.on('pointerdown', () => {
    //     scene.socket.emit("dealCards", scene.socket.id);
    //     scene.dealCards.disableInteractive();
    // })

    // scene.dealCards.on('pointerover', () => {
    //     scene.dealCards.setColor('#ff69b4');
    // })

    // scene.dealCards.on('pointerout', () => {
    //     scene.dealCards.setColor('#00ffff')
    // })

    // scene.input.on('pointerover', (_: any, gameObjects: GameObjects.Image[]) => {
    //   const pointer = scene.input.activePointer;
    //   if (gameObjects[0].type === "Image" && gameObjects[0].data.list.name !== "cardBack") {
    //     scene.cardPreview = scene.add.image(pointer.worldX, pointer.worldY, gameObjects[0].data.values.sprite).setScale(0.5, 0.5);
    //   };
    // });

    // scene.input.on('pointerout', (_: any, gameObjects: GameObjects.Image[]) => {
    //   if (gameObjects[0].type === "Image" && gameObjects[0].data.list.name !== "cardBack") {
    //     scene.cardPreview?.setVisible(false);
    //   };
    // });

    scene.input.on("dragstart", (_: Input.Pointer, card: GameObjects.Image) => {

      // is the card in hand?
      if (scene.handGroup.contains(card)) {
        console.log('aqui')

        // remove card from hand
        card.setTint(0xff69b4);
        scene.handGroup.remove(card);
        scene.children.bringToTop(card);
        scene.cardPreview?.setVisible(false);

        // re-arrange cards in hand
        this.arrangeCardsInHand();

        // bring the card in front
        // card.setDepth(scene.handGroup.countActive());
      };
    });

    scene.input.on("drag", (pointer: Input.Pointer, card: GameObjects.Image, dragX: number, dragY: number) => {
      // if the card is not in hand and not on the board...
      if (scene.handGroup && !scene.handGroup.contains(card) && scene.boardGroup && !scene.boardGroup.contains(card)) {
        // move the card to pointer position
        console.log('aqui 2')
        card.x = dragX
        card.y = dragY
      }
    });

    scene.input.on("dragenter", (_: Input.Pointer, gameObject: GameObjects.Image, dropZone: GameObjects.Zone) => {
      // show card preview
      // this.cardPreview.visible = true;

      // arrange cards on board
      this.arrangeCardsOnBoard(true);
      const zonePosition = Number.parseInt(dropZone.name)

      if (zonePosition >= 0) {
        if (zonePosition < 5 && gameObject.name === 'player1' || zonePosition >= 5 && gameObject.name === 'player2') {
          this.changeDropzoneColor(0x11ff00, zonePosition, scene)

          return
        }
        this.changeDropzoneColor(0xff3300, zonePosition, scene)

      }
    });

    scene.input.on("dragleave", (_: Input.Pointer, gameObject: GameObjects.Image, dropZone: GameObjects.zone) => {

      // hide card preview
      // this.cardPreview.visible = false;

      // arrange cards on board
      // this.arrangeCardsOnBoard(false);
      const zonePosition = Number.parseInt(dropZone.name)

      if (zonePosition >= 0) {
        this.changeDropzoneColor(0xffffff, zonePosition)
      }
    });

    scene.input.on("drop", (_: Input.Pointer, card: GameObjects.Image, dropZone: GameObjects.Zone) => {
      // Ajustar
      // if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready") {
      //   gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
      //   gameObject.y = dropZone.y;
      //   // scene.dropZone.data.values.cards++;
      //   scene.input.setDraggable(gameObject, false);
      //   // scene.socket.emit('cardPlayed', gameObject.data.values.name, scene.socket.id);
      // }
      // else {
      //   gameObject.x = gameObject.input?.dragStartX ?? 0;
      //   gameObject.y = gameObject.input?.dragStartY ?? 0;
      // }

      const zonePosition = Number.parseInt(dropZone.name)

      console.log(scene.GameHandler.isMyTurn, scene.GameHandler.gameState === "Ready")
      if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready") {
        card.x = dropZone.x;
        card.y = dropZone.y + 100;

        if (card.input) {
          card.input.enabled = false;
        }

        if (zonePosition >= 0) {
          this.changeDropzoneColor(0xffff00, zonePosition)
        }

        if (dropZone.input) dropZone.input.dropZone = false

        return
      }

      scene.handGroup.add(card);

      card.x = card.input?.dragStartX ?? 0;
      card.y = card.input?.dragStartY ?? 0;
      // arrange cards in hand
      this.arrangeCardsInHand();
      return
    });

    scene.input.on('dragend', (_: Input.Pointer, gameObject: GameObjects.Image, dropped: boolean) => {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject?.input?.dragStartX ?? 0;
        gameObject.y = gameObject?.input?.dragStartY ?? 0;
      }
    })

    // listener fired when we stop dragging
    scene.input.on("dragend", (_: Input.Pointer, card: GameObjects.Image, dropped: boolean) => {
      if (!scene.handGroup.contains(card) && !scene.boardGroup.contains(card)) {
        // hide card preview
        // this.cardPreview.visible = false;

        // if the card hasn't been dropped in the drop zone...

        if (!dropped) {
          // add dragged card to hand group
          scene.handGroup.add(card);

          card.x = card.input?.dragStartX ?? 0;
          card.y = card.input?.dragStartY ?? 0;
          // arrange cards in hand
          this.arrangeCardsInHand();
        }
      }
    });
  }


  arrangeCardsInHand() {
    this.localScene.handGroup.children.iterate((card, i): boolean => {
      card.setDepth(i);
      const coordinates = this.setHandCoordinates(i, this.localScene.handGroup.countActive());
      this.localScene.tweens.add({
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

  changeDropzoneColor(color: number, zonePosition: number) {
    if (this.localScene.zones && this.localScene.zones[zonePosition]) {
      // this.localScene.zones[zonePosition].graphic.clear();
      // this.localScene.zones[zonePosition].graphic.lineStyle(2, color);
      // this.localScene.zones[zonePosition]
      //   .graphic
      //   .strokeRect(
      //     this.localScene.zones[zonePosition].zone.x - this.localScene.zones[zonePosition]?.zone?.input?.hitArea.width / 2,
      //     this.localScene.zones[zonePosition].zone.y - this.localScene.zones[zonePosition]?.zone?.input?.hitArea?.height / 2,
      //     this.localScene.zones[zonePosition]?.zone?.input?.hitArea.width,
      //     this.localScene.zones[zonePosition]?.zone?.input?.hitArea.height
      //   )
    }
  }

  setPreviewCoordinates(n: number, totalCards: number) {
    return {
      x: this.getWidth() / 2 - (totalCards - 1)
        * this.localScene.gameOptions.cardWidth
        * this.localScene.gameOptions.boardSizeRatio * 0.6 + n
        * this.localScene.gameOptions.cardWidth * this.localScene.gameOptions.boardSizeRatio * 1.2,
      y: 700
    }
  }

  // method to arrange cards on board
  // preview = true if we have to show card preview
  arrangeCardsOnBoard(hasPreview: boolean) {

    // determine the amount of cards on board, preview included
    const cardsOnBoard = this.localScene.boardGroup.countActive() + (hasPreview ? 1 : 0);

    // set position of the cards on board
    this.localScene.boardGroup.children.iterate((card, i) => {
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

}
