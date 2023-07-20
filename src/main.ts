import { AUTO, Game, Physics, Scene, Types } from 'phaser';

class MainScene extends Scene {
  private platforms: Physics.Arcade.StaticGroup | undefined;

  create() {
    // positions are via the center; so this asset is positioned so its center is at 400x300
    this.add.image(400, 300, 'sky');

    // Add a group of static bodies (those not affected by physics) to the scene
    this.platforms = this.physics.add.staticGroup();
    // scale this one so it's the full width of the viewport
    // then sync the scaled object's new size with the physics system (refreshBody)
    // so that the physics system knows that it's double the size
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    // create 3 small platforms
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
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
}

const config: Types.Core.GameConfig = {
  height: 600,
  parent: 'app',
  physics: {
    arcade: {
      debug: false,
      gravity: { y: 300 },
    },
    default: 'arcade',
  },
  scene: [MainScene],
  type: AUTO,
  width: 800,
};

export default new Game(config);
