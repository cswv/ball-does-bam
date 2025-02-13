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
import { eventTarget, GameEvents } from "./GameEvents";
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
  @property({ type: Node })
  public endMenu: Node | null = null;
  @property({ type: PaddleController })
  public paddleCtrl: PaddleController | null = null;
  @property({ type: BallController })
  public ballCtrl: BallController | null = null;
  @property({ type: Label })
  public scoreLabel: Label | null = null;
  @property({ type: Label })
  public livesLabel: Label | null = null;
  @property({ type: Label })
  public resultsLabel: Label | null = null;
  @property({ type: Label })
  public resultScoreLabel: Label | null = null;
  private _bricksDestroyed = 0;

  start() {
    this.setCurState(GameState.INIT);
  }

  init() {
    if (this.startMenu) {
      this.startMenu.active = true;
    }

    if (this.endMenu) {
      this.endMenu.active = false;
    }

    this.generateBricks();

    if (this.paddleCtrl) {
      this.paddleCtrl.setActive(false);
    }
    if (this.ballCtrl) {
      this.ballCtrl.setActive(false);
    }
  }

  onStartButtonClicked() {
    this.setCurState(GameState.PLAYING);
  }

  onStartAgainButtonClicked() {
    this.generateBricks();
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
        this.endGame();
        break;
    }
  }

  startPlaying() {
    if (this.startMenu) {
      this.startMenu.active = false;
    }

    if (this.endMenu) {
      this.endMenu.active = false;
    }

    if (this.scoreLabel) {
      this.scoreLabel.string = "0";
    }

    if (this.livesLabel) {
      this.livesLabel.string = "3";
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

    eventTarget.on(GameEvents.GOT_SCORE, this.onGotScore, this);
    eventTarget.on(GameEvents.LOST_LIFE, this.onLifeLost, this);
    eventTarget.on(GameEvents.BRICK_DESTROYED, this.onBrickDestroyed, this);
  }

  endGame() {
    if (this.paddleCtrl) {
      this.paddleCtrl.setActive(false);
    }
    if (this.ballCtrl) {
      this.ballCtrl.setActive(false);
    }

    if (this._bricksDestroyed === BRICK_COLUMNS * BRICK_ROWS) {
      this.resultsLabel.string = "Вы победили!";
    } else {
      this.resultsLabel.string = "Вы програли!";
    }
    this.resultScoreLabel.string = `Ваш счёт: ${this.scoreLabel.string}`;

    if (this.endMenu) {
      this.endMenu.active = true;
    }

    eventTarget.off(GameEvents.GOT_SCORE, this.onGotScore, this);
    eventTarget.off(GameEvents.LOST_LIFE, this.onLifeLost, this);
    eventTarget.off(GameEvents.BRICK_DESTROYED, this.onBrickDestroyed, this);
  }

  generateBricks() {
    this.node.removeAllChildren();

    const bricks: BrickType[][] = [[]];
    for (let i = 0; i < BRICK_COLUMNS; i++) {
      const bricksCol = [];
      for (let j = 0; j < BRICK_ROWS; j++) {
        bricksCol.push(Math.floor(Math.random() * 3) < 2 ? 0 : 1);
      }
      bricks.push(bricksCol);
    }

    for (let i = 0; i < bricks.length; i++) {
      for (let j = 0; j < bricks[i].length; j++) {
        let brick: Node | null = this.spawnBrickByType(bricks[i][j]);
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

  onGotScore() {
    this.scoreLabel.string = `${parseInt(this.scoreLabel.string) + 1}`;
  }

  onLifeLost() {
    if (this.livesLabel.string === "1") {
      this.setCurState(GameState.END);
    }
    this.livesLabel.string = `${parseInt(this.livesLabel.string) - 1}`;
  }

  onBrickDestroyed() {
    this._bricksDestroyed++;
    if (this._bricksDestroyed === BRICK_COLUMNS * BRICK_ROWS) {
      this.setCurState(GameState.END);
    }
  }
}
