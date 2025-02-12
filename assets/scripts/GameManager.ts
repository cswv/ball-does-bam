import {
  _decorator,
  BoxCollider2D,
  Color,
  Component,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
} from "cc";
import { PaddleController } from "./PaddleController";
import { BallController } from "./BallController";
const { ccclass, property } = _decorator;

enum BrickType {
  RED,
  BLUE,
}

enum GameState {
  INIT,
  PLAYING,
  END,
}

const BRICK_WIDTH = 100;
const BRICK_HEIGHT = 50;
const TOP_Y = 620;
const DIST_BETWEEN = 10;
const DIST_FROM_LEFT = 20;
const BRICK_ROWS = 5;
const BRICK_COLUMNS = 11;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: Prefab })
  public brickPrefab: Prefab | null = null;
  @property({ type: Node })
  public startMenu: Node | null = null;
  @property({ type: PaddleController })
  public paddleCtrl: PaddleController | null = null;
  @property({ type: BallController })
  public ballCtrl: BallController | null = null;
  @property({ type: Label })
  public scoreLabel: Label | null = null;
  private _bricks: BrickType[][] = [[]];

  start() {
    this.setCurState(GameState.INIT);
  }

  init() {
    if (this.startMenu) {
      this.startMenu.active = true;
    }

    this.generateBricks();

    if (this.paddleCtrl) {
      this.paddleCtrl.setActive(false);
      this.ballCtrl.setActive(false);
    }
  }

  onStartButtonClicked() {
    this.setCurState(GameState.PLAYING);
  }

  update(deltaTime: number) {}

  setCurState(value: GameState) {
    switch (value) {
      case GameState.INIT:
        this.init();
        break;
      case GameState.PLAYING:
        this.startPlaying();
        break;
      case GameState.END:
        break;
    }
  }

  startPlaying() {
    if (this.startMenu) {
      this.startMenu.active = false;
    }

    if (this.scoreLabel) {
      this.scoreLabel.string = "0";
    }

    setTimeout(() => {
      if (this.paddleCtrl) {
        this.paddleCtrl.setActive(true);
      }
    }, 0.1);

    setTimeout(() => {
      if (this.ballCtrl) {
        this.ballCtrl.setActive(true);
      }
    }, 0.2);
  }

  generateBricks() {
    this.node.removeAllChildren();

    for (let i = 0; i < BRICK_COLUMNS; i++) {
      const bricks = [];
      for (let j = 0; j < BRICK_ROWS; j++) {
        bricks.push(Math.floor(Math.random() * 2));
      }
      this._bricks.push(bricks);
    }

    for (let i = 0; i < this._bricks.length; i++) {
      for (let j = 0; j < this._bricks[i].length; j++) {
        let brick: Node | null = this.spawnBrickByType(this._bricks[i][j]);
        if (brick) {
          this.node.addChild(brick);
          brick.setPosition(
            i * BRICK_WIDTH + DIST_BETWEEN * i - DIST_FROM_LEFT,
            TOP_Y - j * BRICK_HEIGHT - DIST_BETWEEN * j,
            0
          );
          let collider = brick.getComponent(BoxCollider2D);
          if (collider) {
            collider.apply();
          }
        }
      }
    }
  }

  spawnBrickByType(type: BrickType) {
    if (!this.brickPrefab) {
      return null;
    }

    let brick: Node | null = null;
    switch (type) {
      case BrickType.RED:
        brick = instantiate(this.brickPrefab);
        brick.getComponent(Sprite).color = Color.RED;
        break;
      case BrickType.BLUE:
        brick = instantiate(this.brickPrefab);
        brick.getComponent(Sprite).color = Color.BLUE;
        break;
    }

    return brick;
  }
}
