import { Physics, Scene } from 'phaser';

class Player extends Physics.Arcade.Sprite {
  private startingPosition = {
    x: 0,
    y: 0,
  };

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.startingPosition = {
      x,
      y,
    };

    this.addToScene();
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setupAnimations();
  }

  private addToScene() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  private setupAnimations() {
    // animation for movin <-
    this.anims.create({
      frameRate: 20,
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      key: 'left',
      repeat: -1,
    });

    // animation for moving ->
    this.anims.create({
      frameRate: 20,
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      key: 'right',
      repeat: -1,
    });

    // animation for standing still
    this.anims.create({
      frameRate: 20,
      frames: [{ frame: 4, key: 'dude' }],
      key: 'turn',
    });
  }

  reset() {
    const { x, y } = this.startingPosition;

    this.clearTint();
    this.anims.stop();
    this.setPosition(x, y);
  }
}

export default Player;
