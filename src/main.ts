import { AUTO, Game, Scene, Types } from 'phaser';

class MainScene extends Scene {
  create() {
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'star');
  }
  preload() {
    this.load.image('bomb', 'assets/images/bomb.png');
    this.load.image('ground', 'assets/images/platform.png');
    this.load.image('sky', 'assets/images/sky.png');
    this.load.image('star', 'assets/images/star.png');

    this.load.spritesheet('dude', 'assets/sheets/dude.png', {
      frameHeight: 48,
      frameWidth: 32,
    });
  }
  update() {}
}

const config: Types.Core.GameConfig = {
  height: 600,
  parent: 'app',
  scene: [MainScene],
  type: AUTO,
  width: 800,
};

export default new Game(config);
