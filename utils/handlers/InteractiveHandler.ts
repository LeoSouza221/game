import type { GameObjects } from "phaser";
import type { MainMenu } from "../game/scenes/MainMenu";

export default class InteractiveHandler {
  constructor(scene: MainMenu) {

    scene.cardPreview = undefined;

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


    scene.input.on('pointerover', (_: any, gameObjects: GameObjects.Image[]) => {
      const pointer = scene.input.activePointer;
      if (gameObjects[0].type === "Image" && gameObjects[0].data.list.name !== "cardBack") {
        scene.cardPreview = scene.add.image(pointer.worldX, pointer.worldY, gameObjects[0].data.values.sprite).setScale(0.5, 0.5);
      };
    });

    scene.input.on('pointerout', (_: any, gameObjects: GameObjects.Image[]) => {
      if (gameObjects[0].type === "Image" && gameObjects[0].data.list.name !== "cardBack") {
        scene.cardPreview?.setVisible(false);
      };
    });

    scene.input.on('drag', (_, gameObject: GameObjects.Image, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    })

    scene.input.on('dragstart', (_, gameObject: GameObjects.Image) => {
      gameObject.setTint(0xff69b4);
      scene.children.bringToTop(gameObject);
      scene.cardPreview?.setVisible(false);
    })

    scene.input.on('dragend', (_, gameObject: GameObjects.Image, dropped: boolean) => {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject?.input?.dragStartX ?? 0;
        gameObject.y = gameObject?.input?.dragStartY ?? 0;
      }
    })

    scene.input.on('drop', (_, gameObject: GameObjects.Image, dropZone: GameObjects.Zone) => {
      if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready") {
        gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
        gameObject.y = dropZone.y;
        // scene.dropZone.data.values.cards++;
        scene.input.setDraggable(gameObject, false);
        // scene.socket.emit('cardPlayed', gameObject.data.values.name, scene.socket.id);
      }
      else {
        gameObject.x = gameObject.input?.dragStartX ?? 0;
        gameObject.y = gameObject.input?.dragStartY ?? 0;
      }
    })

  }
}
