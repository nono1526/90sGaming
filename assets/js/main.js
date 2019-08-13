const BACKGROUND_PATH = './assets/img/background/'
let mainMt
let packMt
let street
const level1 = {
  preload () {
    this.load.image('sky', `${BACKGROUND_PATH}L1_sky.png`)
    this.load.image('lv1MainMt', `${BACKGROUND_PATH}L1_mountain_main.png`)
    this.load.image('lv1PackMt', `${BACKGROUND_PATH}L1_mountain_pack.png`)
    this.load.image('lv1Street', `${BACKGROUND_PATH}L1_street.png`)
    
  },
  create () {
    this.add.image(600, 129, 'sky')
    street = this.add.tileSprite(600, 529, 1200, 543, 'lv1Street')
    packMt = this.add.tileSprite(600, 129, 1200, 258, 'lv1PackMt')
    mainMt = this.add.tileSprite(600, 136, 1200, 258, 'lv1MainMt')
  },
  update () {
    packMt.tilePositionX += 4
    mainMt.tilePositionX += 8
    street.tilePositionX += 10
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
        y: 200
      }
    }
  },
  scene: [level1]
}


const game = new Phaser.Game(config)