const BACKGROUND_PATH = './assets/img/background/'
const PLAYER_PATH = './assets/img/protagonist/'
let mainMt
let packMt
let street
let player
let cursors
let enemies = []
let group
let isPlaying = true
const ENEMY_LIST = ['tree', 'monster']
const level1 = {
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
  },
  create () {
    this.add.image(600, 129, 'sky')
    street = this.add.tileSprite(600, 529, 1200, 543, 'lv1Street')
    packMt = this.add.tileSprite(600, 129, 1200, 258, 'lv1PackMt')
    mainMt = this.add.tileSprite(600, 136, 1200, 258, 'lv1MainMt')
    player = this.physics.add.sprite(100, 500, 'player', 0)
    
    



    this.physics.world.setBounds(0, 250, 1200, 430)
    this.anims.create({
      key: 'walk',
      frames:  this.anims.generateFrameNames('player', { start: 1, end: 9 }),
      frameRate: 12,
      repeat: -1
    })

    player.setCollideWorldBounds(true)
    player.setDepth(1)
    player.play('walk').setScale(0.3).setSize(400, 120).setOffset(130, 620)
    // create block group
    group = this.add.group({ maxSize: 10 })
    group.setDepth(1)

    cursors = this.input.keyboard.createCursorKeys()

    this.physics.add.overlap(player, group, () => {
      isPlaying = false
    })
  },
  createBlock (block) {
    Phaser.Geom.Rectangle.Random(this.physics.world.bounds, block)
    block.setVelocityX(-200)
  },
  update (time, delta) {
    if (!isPlaying) return
    if (Phaser.Math.Between(1, 1000) < 20 && group.getChildren().length < 10) {
      
      let y = Phaser.Math.Between(300, 700)
      group.add(this.physics.add.sprite(1200, y, ENEMY_LIST[Phaser.Math.Between(0, 1)], 0))
    }
    group.getChildren().forEach((enemy) => {
      enemy.setVelocityX(-200)
      if (enemy.x < -100) {
        console.log(enemy + '881')
        enemy.destroy()
      }
    })


    packMt.tilePositionX += 4
    mainMt.tilePositionX += 8
    street.tilePositionX += 10
    player.setVelocity(0)
    if (cursors.left.isDown) {
      player.setVelocityX(-300)
    } else if (cursors.right.isDown) {
      player.setVelocityX(300)
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-300)
    } else if (cursors.down.isDown) {
      player.setVelocityY(300)
    }

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
  scene: [level1]
}


const game = new Phaser.Game(config)