import {
  AUTO,
  Game,
  GameObjects,
  Math,
  Physics,
  Scene,
  Structs,
  Types,
} from 'phaser';

class MainScene extends Scene {
  private bombs: Physics.Arcade.Group | undefined;
  private cursors: Types.Input.Keyboard.CursorKeys | undefined;
  private gameOver = false;
  private level = 0;
  private levelText: GameObjects.Text | undefined;
  private options = {
    bombs: true,
  };
  private platforms: Physics.Arcade.StaticGroup | undefined;
  private player: Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private score = 0;
  private scoreText: GameObjects.Text | undefined;
  private stars: Physics.Arcade.Group | undefined;

  create() {
    // positions are via the center; so this asset is positioned so its center is at 400x300
    this.add.image(400, 300, 'sky');

    this.gameOver = false;
    this.setupLevel();
    this.setupPlatforms();
    this.setupPlayer();
    this.setupStars();
    this.setupBombs();
    this.setupCollisions();
    this.setupKeys();
    this.setupScore();
  }

  private setupLevel() {
    this.levelText = this.add.text(600, 16, '', {
      align: 'right',
      color: '#000',
      fontSize: '32px',
    });
    this.updateLevel();
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

  private setupStars() {
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 1,
      setXY: { stepX: 70, x: 12, y: 0 },
    });

    (this.stars.children as Structs.Set<Physics.Arcade.Image>).iterate(
      (child) => {
        child.setBounceY(Math.FloatBetween(0.4, 0.8));
      }
    );
  }

  private setupBombs() {
    this.bombs = this.physics.add.group();
  }

  private setupCollisions() {
    const bombs = this.bombs!;
    const stars = this.stars!;
    const platforms = this.platforms!;
    const player = this.player!;

    // make collisions with platform
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    // setup collision so player can collect stars
    this.physics.add.overlap(player, stars, this.collectStar, undefined, this);

    // setup collision for bomb to explode when a player hits it
    this.physics.add.overlap(player, bombs, this.hitBomb, undefined, this);
  }

  private collectStar(
    __player: Types.Physics.Arcade.GameObjectWithBody,
    star: Types.Physics.Arcade.GameObjectWithBody
  ) {
    (star as Physics.Arcade.Image).disableBody(true, true);

    this.updateScore(this.score + 10);

    if (this.stars!.countActive(true) === 0) {
      this.updateLevel(this.level + 1);
      this.resetStars();

      if (this.options.bombs) {
        this.addBomb();
      }
    }
  }

  private addBomb() {
    const bombs = this.bombs!;
    const player = this.player!;

    const x = player.x < 400 ? Math.Between(400, 800) : Math.Between(0, 400);
    const bomb = bombs.create(x, 16, 'bomb') as Physics.Arcade.Body;

    bomb
      .setBounce(1, 1)
      .setCollideWorldBounds(true)
      .setVelocity(Math.Between(-200, 200), 20);
  }

  private hitBomb(player: Types.Physics.Arcade.GameObjectWithBody) {
    this.physics.pause();

    (player as Physics.Arcade.Sprite).setTint(0xff0000).anims.play('turn');
    this.gameOver = true;
  }

  private setupKeys() {
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.input.keyboard.on('keydown-ESC', this.openMenu, this);
    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (event.shiftKey && (event.key === 'B' || event.key === 'b')) {
        if (this.gameOver) {
          console.info('WTF?');
        }

        this.toggleBombs();
      } else if (this.gameOver && (event.key === 'R' || event.key === 'r')) {
        this.resetGame();
      }
    });
  }

  private setupScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'score: 0', {
      color: '#000',
      fontSize: '32px',
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

  update() {
    const cursors = this.cursors!;
    const player = this.player!;

    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-330);
    }
  }

  private toggleBombs() {
    this.options.bombs = !this.options.bombs;

    if (!this.options.bombs) {
      this.resetBombs();
    } else {
      this.restoreBombs();
    }
  }

  private restoreBombs() {
    for (let i = 0; i < this.level; i = i + 1) {
      this.addBomb();
    }
  }

  private resetGame() {
    this.gameOver = false;
    this.resetBombs();
    this.updateLevel();
    this.resetPlayer();
    this.resetStars();
    this.updateScore();
    this.physics.resume();
  }

  private resetBombs() {
    this.bombs!.clear(true, true);
  }

  private resetPlayer() {
    const player = this.player! as Physics.Arcade.Sprite;
    player.clearTint().anims.stop();
    player.setPosition(100, 450);
  }

  private resetStars() {
    (this.stars!.children as Structs.Set<Physics.Arcade.Image>).iterate(
      (child) => {
        child.disableBody(true, true).enableBody(true, child.x, 0, true, true);
      }
    );
  }

  private updateLevel(newLevel = 1) {
    this.level = newLevel;
    this.levelText!.setText(`Level: ${this.level}`);
  }

  private updateScore(newScore = 0) {
    this.score = newScore;
    this.scoreText!.setText(`Score: ${this.score}`);
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
