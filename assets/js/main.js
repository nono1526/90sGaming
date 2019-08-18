
const BACKGROUND_PATH = './assets/img/background/'
const PLAYER_PATH = './assets/img/protagonist/'
const BACKGROUND_UI = './assets/img/UI/'
const TIME = 90
const GAME_BOUNDARY = {
  width: 1200,
  height: 800
}

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
    this.textTimer
    this.remainTime = 90
    this.healthGroup
  }
  preload () {
    this.load.image('sky', `${BACKGROUND_PATH}L1_sky.png`)
    this.load.image('lv1MainMt', `${BACKGROUND_PATH}L1_mountain_main.png`)
    this.load.image('lv1PackMt', `${BACKGROUND_PATH}L1_mountain_pack.png`)
    this.load.image('lv1Street', `${BACKGROUND_PATH}L1_street.png`)
    this.load.image('btn', `${BACKGROUND_UI}button.png`)
    this.load.spritesheet('player', `${PLAYER_PATH}archer_run_1.png`, {
      frameWidth: 590,
      frameHeight: 780
    })
    this.load.image('tree', `${BACKGROUND_PATH}L1_block_1.png`)
    this.load.image('monster', `${BACKGROUND_PATH}L1_block_2.png`)
    this.load.image('lifeUI', `${BACKGROUND_UI}info_archer.png`)
    this.load.image('timeUI', `${BACKGROUND_UI}time.png`)
    this.load.image('healthUI', `${BACKGROUND_UI}life.png`)

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

    this.textTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimeUI,
      callbackScope: this,
      loop: true
    })
    
    this.physics.add.overlap(this.player, this.group, this.collisionMonster.bind(this) )
    this.createBtn(100, GAME_BOUNDARY.height - 100, '重新開始', this.restart)
      .setDepth(2)
    this.createBtn(220, GAME_BOUNDARY.height - 100, '返回選單', this.backToMenu)
      .setDepth(2)
    this.healthGroup = this.add.group()
    let lifeIntervalWidth = 60
    for (let i = 0; i < 3; i++) {
      this.healthGroup.add(this.add.image(230 + lifeIntervalWidth * i, 80, 'healthUI')).setDepth(4)
    }
    this.add.image(200, 80, 'lifeUI').setDepth(2)
    this.add.image(GAME_BOUNDARY.width - 200, 48, 'timeUI').setDepth(2)
    this.textUI = this.add.text(GAME_BOUNDARY.width - 260, 20, '01:30', { fontFamily: '"Noto Sans TC"', fontSize: 48}).setDepth(3)
    // this.showGameOverNotice()
  }
  
  updateTimeUI () {
    this.remainTime -= 1
    const remainMin = Math.floor(this.remainTime / 60)
    const remainSec = this.remainTime % 60
    this.textUI.setText(`0${remainMin}:${remainSec < 10 ? '0' : ''}${remainSec}`)
  }
  collisionMonster (obj, obj2) {
    this.group.remove(obj2)
    obj2.setVisible(false)
    const lastChild = this.healthGroup.getChildren()[this.healthGroup.getChildren().length - 1]
    lastChild.setVisible(false)
    this.healthGroup.remove(lastChild)
    if (this.healthGroup.getLength() === 0) {
      this.isPlaying = false
    }

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

  restart () {
    this.scene.restart()
    this.timer.paused = false
    this.isPlaying = true
  }
  backToMenu () {
    console.log('back')
  }
  createBtn (x, y, text, callBack) {
    const btn = this.add.image(x, y, 'btn')
    this.add.text(x - 30, y - 10, text, { fontFamily: '"Noto Sans TC"'}).setDepth(5)
    btn.setInteractive({ useHandCursor: true })
    btn.on('pointerdown', callBack, this)
    return btn
  }
  update (time, delta) {
    if (!this.isPlaying) {
      // this.scene.sleep()
      this.isPlaying = true
      this.timer.paused = true
      // this.group.destroy()
      this.scene.pause()
      this.scene.launch('GameOver')
      return 
    }
    this.group.getChildren().forEach((enemy) => {
      if (enemy.x < -100) {
        enemy.destroy()
      }
    })
    this.packMt.tilePositionX += 4
    this.mainMt.tilePositionX += 8
    this.street.tilePositionX += 10
    this.player.setVelocity(0)
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300)
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
class GameOver extends Phaser.Scene {
  constructor () {
    super('GameOver')
  }

  reload () {
    this.load.image('btn', `${BACKGROUND_UI}button.png`)
  }
  restart () {
    console.log('halo?')
    this.scene.resume('Level1')
    this.scene.stop()
    this.scene.stop('Level1')
    this.scene.start('Level1')

  }
  backToMenu () {
    console.log('back')
  }
  create () {
    const graphics = this.add.graphics()
    const dialog = new Phaser.Geom.Rectangle(0, 0, GAME_BOUNDARY.width, GAME_BOUNDARY.height)
    graphics.fillStyle(0x333333, 1)
    graphics.alpha = 0.5
    graphics
    graphics.fillRectShape(dialog)
    this.createBtn(GAME_BOUNDARY.width / 2 - 80, GAME_BOUNDARY.height / 2 + 100, '重新開始', this.restart)
    this.createBtn(GAME_BOUNDARY.width / 2 + 80, GAME_BOUNDARY.height / 2 + 100, '返回選單', this.backToMenu)
    this.add.text(GAME_BOUNDARY.width / 2 - 120, GAME_BOUNDARY.height / 2 - 150, 'OPS', { fontFamily: '"Noto Sans TC"', fontSize: '120px'})
    this.add.text(GAME_BOUNDARY.width / 2 - 220, GAME_BOUNDARY.height / 2, '別急，勇者之路永遠為你敞開', { fontFamily: '"Noto Sans TC"', fontSize: '36px'})
    this.group
  }
  createBtn (x, y, text, callBack) {
    const btn = this.add.image(x, y, 'btn')
    this.add.text(x - 30, y - 10, text, { fontFamily: '"Noto Sans TC"'}).setDepth(5)
    btn.setInteractive({ useHandCursor: true })
    btn.on('pointerdown', callBack, this)
    return btn
  }
}


const level1 = new Level1

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
      // debug: true
    }
  },
  scene: [Level1, GameOver]
}


const game = new Phaser.Game(config)