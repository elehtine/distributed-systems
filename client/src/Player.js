import Phaser from 'phaser';

const hashString = (str) => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, id, isClientPlayer = false) {
    super(scene, x, y, texture, frame);
    this.scale = 0.5;

    this.id = id;
    this.lastUpdated = Date.now();
    this.animationState = 'idle';
    this.clientInput = {};
    this.flipX = false;
    this.isClientPlayer = isClientPlayer;

    // Add the player to the scene
    scene.add.existing(this);

    // Add physics
    scene.physics.add.existing(this);

    this.body.setSize(20, 12, false);
    this.body.setOffset(14, 40);

    // Create animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('charactersheet', { start: 36, end: 40 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('charactersheet', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'roll',
      frames: this.anims.generateFrameNumbers('charactersheet', { start: 41, end: 48 }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'death',
      frames: this.anims.generateFrameNumbers('charactersheet', { start: 6, end: 7 }),
      frameRate: 2,
      repeat: 0,
    });

    // Set idle animation
    this.anims.play('idle');

    // Give player random color tint
    const max = 0xFFFFFF;
    this.tint = hashString(id) % max;
  }

  update() {
    if (this.isDead) return;

    let isRunning = this.animationState === 'walk' || Object.values(this.clientInput).some((v) => v);

    const isRolling = this.anims.currentAnim.key === 'roll' && !this.anims.currentFrame.isLast;
    if (isRolling) { // Keep rolling until anim ends...
      return;
    }

    if (this.clientInput.left) {
      this.setFlipX(true);
    } else if (this.clientInput.right) {
      this.setFlipX(false);
    }

    if (isRunning) {
      this.anims.play('walk', true);
    } else {
      this.anims.play('idle', true);
    }
  }
}
