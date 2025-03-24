import type { MainMenu } from "../game/scenes/MainMenu";
import ZoneHandler from "./ZoneHandler";

export class UiHandler {
  zoneHandler: ZoneHandler
  buildZones: (zoneQuantity: number) => void
  buildUI: (zoneQuantity: number) => void
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

    this.buildUI = (zoneQuantity: number) => {
      this.buildZones(zoneQuantity);
      // this.buildPlayerAreas();
      // this.buildGameText();
    }
  }
}
