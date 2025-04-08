import type { GameObjects } from "phaser";
import type { MainMenu } from "../game/scenes/MainMenu";

export class BarHandler {
  bar: GameObjects.Graphics;
  x: number;
  y: number;
  value: number;
  p: number;

  constructor(scene: MainMenu, x: number, y: number) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = 100;

    this.draw(scene);

    scene.add.existing(this.bar);
  }

  decrease(amount: number) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    // this.draw(scene);

    return (this.value === 0);
  }

  draw(scene: MainMenu) {
    this.bar.clear();

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, scene.getWidth(), 50);

    //  Health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 2, this.y + 2, scene.getWidth(), 50);

    if (this.value < 30) {
      this.bar.fillStyle(0xff2975);
    }
    else {
      this.bar.fillStyle(0xff901f);
    }

    const d = Math.floor(this.p * this.value);

    this.bar.fillRect(this.x + 2, this.y + 2, d, 50);
  }

}
