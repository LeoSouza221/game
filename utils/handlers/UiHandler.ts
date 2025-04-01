import type { MainMenu } from "../game/scenes/MainMenu";
import ZoneHandler from "./ZoneHandler";

export class UiHandler {
  zoneHandler: ZoneHandler
  buildZones: (zoneQuantity: number) => void
  buildUI: (zoneQuantity: number) => void
  buildGameText: () => void
  constructor(scene: MainMenu) {
    this.zoneHandler = new ZoneHandler(scene);


    this.buildZones = (zoneQuantity: number) => {
      let coordinateX = 140
      for (let i = 0; i < zoneQuantity; i++) {
        const zone = this.zoneHandler.renderZone(coordinateX);

        console.log(scene.zones)
        scene.zones.push({ zone })

        this.zoneHandler.renderOutline(scene.zones[i].zone);

        coordinateX += 200
      }
    }

    this.buildGameText = () => {
      const height = scene.game.config.height
      scene.passTurn = scene.add.text(900, height - 240, "Pass Turn").setFontSize(30).setFontFamily('Trebuchet MS');
    }

    this.buildUI = (zoneQuantity: number) => {
      this.buildZones(zoneQuantity);
      // this.buildPlayerAreas();
      this.buildGameText();
    }
  }
}
