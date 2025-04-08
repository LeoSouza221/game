import { AUTO, Game, Scale } from 'phaser'
import { MainMenu } from './scenes/MainMenu'

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  title: 'Phaser vue game example',
  type: AUTO,
  height: 1920,
  width: 1080,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  backgroundColor: '#0d0221',
  scene: MainMenu,
}

const StartGame = (parent: string) => {
  return new Game({ ...config, parent })
}

export default StartGame
