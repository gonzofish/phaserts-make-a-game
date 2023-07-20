import { AUTO, Game, Physics, Scene, Types } from 'phaser';

class MainScene extends Scene {
  private platforms: Physics.Arcade.StaticGroup | undefined;
  private player: Types.Physics.Arcade.SpriteWithDynamicBody | undefined;

  create() {
    // positions are via the center; so this asset is positioned so its center is at 400x300
    this.add.image(400, 300, 'sky');

    this.setupPlatforms();
    this.setupPlayer();

    // make the player and the platforms collide with each other
    this.physics.add.collider(this.player!, this.platforms!);
  }

  private setupPlatforms() {
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

  private setupPlayer() {
    this.setupPlayerSprite();
    this.setupPlayerAnimations();
  }

  private setupPlayerSprite() {
    this.player = this.physics.add.sprite(100, 450, 'dude');
    // when the player jumps they'll bounce just a little bit
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
  }

  private setupPlayerAnimations() {
    // moving left animation
    this.anims.create({
      frameRate: 10,
      // generate the frames for the animation using slice 0 to 3 of the dude spritesheet
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      key: 'left',
      repeat: -1,
    });

    // turning/direction change animation
    this.anims.create({
      frameRate: 20,
      frames: [{ frame: 4, key: 'dude' }],
      key: 'turn',
    });

    // moving right animation
    this.anims.create({
      frameRate: 10,
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      key: 'right',
      repeat: -1,
    });
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
      // this sets a gravity in the world; controls how the objects fall in the world
      // the higher the number the harder they fall
      gravity: { y: 300 },
    },
    default: 'arcade',
  },
  scene: [MainScene],
  type: AUTO,
  width: 800,
};

export default new Game(config);
