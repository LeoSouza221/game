import type { GameObjects } from 'phaser'
import type { MainMenu } from '../game/scenes/MainMenu';

export default class ZoneHandler {
  renderZone: GameObjects.Zone
  renderOutline: (dropZone: GameObjects.Zone) => void

  constructor(scene: MainMenu) {
    this.renderZone = (x: number, y: number): GameObjects.Zone => {
      const dropZone = scene.add.zone(x, scene.getHeight() / 2 + 100, 200, 200).setRectangleDropZone(200, 200);
      dropZone.setData({
        "hasCards": false
      });
      return dropZone;
    }

    this.renderOutline = (dropZone: GameObjects.Zone) => {
      const dropZoneOutline = scene.add.graphics();
      dropZoneOutline.lineStyle(4, 0xff69b4);
      dropZoneOutline.strokeRect(
        dropZone.x - dropZone?.input?.hitArea.width / 2,
        dropZone.y - dropZone?.input?.hitArea.height / 2,
        dropZone?.input?.hitArea.width,
        dropZone?.input?.hitArea.height
      );

      dropZone.setData("outline", dropZoneOutline);
    }
  }
}

//  A drop zone
// const zone = this.add.zone(this.getWidth() / 2, this.getHeight() / 2, this.getWidth() - 100, 400).setRectangleDropZone(this.getWidth() - 100, 400);
// this.zones = [
//   {
//     zone: this.add.zone(140, this.getHeight() / 2 + 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(340, this.getHeight() / 2 + 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(540, this.getHeight() / 2 + 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(740, this.getHeight() / 2 + 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(940, this.getHeight() / 2 + 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(140, this.getHeight() / 2 - 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(340, this.getHeight() / 2 - 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(540, this.getHeight() / 2 - 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(740, this.getHeight() / 2 - 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
//   {
//     zone: this.add.zone(940, this.getHeight() / 2 - 100, 200, 200).setRectangleDropZone(200, 200),
//     graphic: this.add.graphics()
//   },
// ]

// this.zones.forEach(async (_, index) => {
//   await this.zones[index].zone.setName(index.toString())
//   await this.zones[index].graphic.setName(index.toString())
//   await this.zones[index].graphic.lineStyle(2, 0xffffff)
//   await this.zones[index]
//     .graphic
//     .strokeRect(
//       this.zones[index].zone.x - this.zones[index]?.zone?.input?.hitArea.width / 2,
//       this.zones[index].zone.y - this.zones[index]?.zone?.input?.hitArea?.height / 2,
//       this.zones[index]?.zone?.input?.hitArea.width,
//       this.zones[index]?.zone?.input?.hitArea.height
//     )
// })
