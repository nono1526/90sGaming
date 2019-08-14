const BACKGROUND_PATH = './assets/img/background/'
const PLAYER_PATH = './assets/img/protagonist/'
let mainMt
let packMt
let street
let player
let cursors
let enemies = []
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
    this.load.image('lv1Enemy', `${BACKGROUND_PATH}L1_block_1.png`)
  },
  create () {
    this.add.image(600, 129, 'sky')
    street = this.add.tileSprite(600, 529, 1200, 543, 'lv1Street')
    packMt = this.add.tileSprite(600, 129, 1200, 258, 'lv1PackMt')
    mainMt = this.add.tileSprite(600, 136, 1200, 258, 'lv1MainMt')
    player = this.physics.add.sprite(100, 500, 'player', 0)
    
    
    for (let i = 0; i < 2; i++) {
      let y = Phaser.Math.Between(300, 500)
      let enemy = this.physics.add.sprite(1200, y, 'lv1Enemy', 0)
      enemies.push(enemy)
    }
    this.physics.world.setBounds(0, 250, 1200, 430)
    this.anims.create({
      key: 'walk',
      frames:  this.anims.generateFrameNames('player', { start: 1, end: 9 }),
      frameRate: 12,
      repeat: -1
    })

    player.setCollideWorldBounds(true)
    player.play('walk').setScale(0.3).setSize(400, 120).setOffset(130,620)

    cursors = this.input.keyboard.createCursorKeys()
  },
  update () {
    enemies.forEach(enemy => {
      enemy.setVelocityX(-200)
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