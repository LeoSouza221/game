import { Display } from "phaser";
import type { MainMenu } from "../game/scenes/MainMenu";
import ZoneHandler from "./ZoneHandler";
import { BarHandler } from "./BarHandler";

export class UiHandler {
  zoneHandler: ZoneHandler
  buildZones: (zoneQuantity: number) => void
  buildUI: (zoneQuantity: number) => void
  buildPassButton: () => void
  buildPlayerHealthBar: () => void
  constructor(scene: MainMenu) {
    this.zoneHandler = new ZoneHandler(scene);


    this.buildZones = (zoneQuantity: number) => {
      let coordinateX = 140
      for (let i = 0; i < zoneQuantity; i++) {
        const zone = this.zoneHandler.renderZone(coordinateX);

        scene.zones.push({ zone })

        this.zoneHandler.renderOutline(scene.zones[i].zone);

        coordinateX += 200
      }
    }

    // this.buildGameText = () => {
    //   const height = scene.game.config.height
    //   scene.passTurn = scene.add.text(900, height - 240, "Pass Turn").setFontSize(30).setFontFamily('Trebuchet MS');
    // }

    this.buildPassButton = () => {
      scene.passTurn = scene.add.circle(scene.getWidth() - 150, scene.getHeight() - 200, 100, 0xff69b4)
      scene.passTurnLabel = scene.add.text(10, 10, 'Pass Turn')
        .setScale(2)
        .setOrigin(.5)
        .setStyle({ fontStyle: 'bold', fontFamily: 'Arial' });

      Display.Align.In.Center(scene.passTurnLabel, scene.passTurn);
    }

    this.buildPlayerHealthBar = () => {
      scene.playerBar = new BarHandler(scene, 0, scene.getHeight() - 50)
    }



    this.buildUI = (zoneQuantity: number) => {
      this.buildZones(zoneQuantity);
      // this.buildPlayerAreas();
      this.buildPassButton();
      this.buildPlayerHealthBar();
    }
  }
}
