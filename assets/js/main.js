const BACKGROUND_PATH = './assets/img/background/'
const PLAYER_PATH = './assets/img/protagonist/'

const ENEMY_LIST = ['tree', 'monster']
class Level1 extends Phaser.Scene {
  constructor () {
    super('Level1')
    this.mainMt
    this.packMt
    this.street
    this.player
    this.cursors
    this.enemies = []
    this.group
    this.isPlaying = true
    this.timer
  }
  preload () {
    this.load.image('sky', `${BACKGROUND_PATH}L1_sky.png`)
    this.load.image('lv1MainMt', `${BACKGROUND_PATH}L1_mountain_main.png`)
    this.load.image('lv1PackMt', `${BACKGROUND_PATH}L1_mountain_pack.png`)
    this.load.image('lv1Street', `${BACKGROUND_PATH}L1_street.png`)
    this.load.spritesheet('player', `${PLAYER_PATH}archer_run_1.png`, {
      frameWidth: 590,
      frameHeight: 780
    })
    this.load.image('tree', `${BACKGROUND_PATH}L1_block_1.png`)
    this.load.image('monster', `${BACKGROUND_PATH}L1_block_2.png`)
  }
  create () {
    this.add.image(600, 129, 'sky')
    this.street = this.add.tileSprite(600, 529, 1200, 543, 'lv1Street')
    this.packMt = this.add.tileSprite(600, 129, 1200, 258, 'lv1PackMt')
    this.mainMt = this.add.tileSprite(600, 136, 1200, 258, 'lv1MainMt')
    this.player = this.physics.add.sprite(100, 500, 'player', 0)
    
    this.physics.world.setBounds(0, 250, 1200, 430)
    this.anims.create({
      key: 'walk',
      frames:  this.anims.generateFrameNames('player', { start: 1, end: 9 }),
      frameRate: 12,
      repeat: -1
    })

    this.player.setCollideWorldBounds(true)
    this.player.setDepth(1)
    this.player.play('walk').setScale(0.3).setSize(380, 100).setOffset(130, 675)
    // create block group
    this.group = this.add.group()
    this.group.setDepth(1)
    
    this.cursors = this.input.keyboard.createCursorKeys()
    
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.createBlock,
      callbackScope: this,
      loop: true
    })

    this.physics.add.overlap(this.player, this.group, () => {
      this.isPlaying = false
    })
  }
  
  createBlock () {
    const rowCount = Phaser.Math.Between(0, 2)
    for (let i = 0; i < rowCount; i++) {
      let y = Phaser.Math.Between(300, 700)
      let enemy = new Enemy({
        scene: this,
        x: 1200,
        y,
        key: ENEMY_LIST[Phaser.Math.Between(0, 1)]
      })
      
      this.group.add(enemy)
    }
  }
  showGameOverNotice () {
    const graphics = this.add.graphics()

    const dialog = new Phaser.Geom.Rectangle(0, 0, 1200, 800)
    graphics.fillStyle(0xb72121, 1)
    graphics.fillRectShape(dialog)
    window.setTimeout(() => {
      this.scene.restart()
      this.timer.paused = false
      this.isPlaying = true
      graphics.destroy()
    }, 5000)
  }
  update (time, delta) {
    if (!this.isPlaying) {
      this.scene.pause()
      this.timer.paused = true
      this.group.destroy()
      this.showGameOverNotice()
      return 
    }
    this.group.getChildren().forEach((enemy) => {
      if (enemy.x < -100) {
        console.log(enemy + '881')
        enemy.destroy()
      }
    })
    this.packMt.tilePositionX += 4
    this.mainMt.tilePositionX += 8
    this.street.tilePositionX += 10
    this.player.setVelocity(0)
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(400)
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-300)
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(300)
    }

  }
}

class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor (config)
    {
      super(config.scene, config.x,config.y, config.key)
      this.speed = config.key === 'tree' ? 200 : Phaser.Math.Between(200, 400)
      config.scene.add.existing(this)
      config.scene.physics.add.existing(this)
      this.setVelocityX(-this.speed)
    }
}


const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: true
    }
  },
  scene: [new Level1]
}


const game = new Phaser.Game(config)