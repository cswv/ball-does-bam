import {
  _decorator,
  BoxCollider2D,
  Color,
  Component,
  instantiate,
  Node,
  Prefab,
  Sprite,
} from "cc";
const { ccclass, property } = _decorator;

enum BrickType {
  RED,
  BLUE,
}

export const BRICK_SIZE = 100;
const TOP_Y = 680;
const DIST_BETWEEN = 10;
const DIST_FROM_LEFT = 30;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: Prefab })
  public brickPrefab: Prefab | null = null;
  public brickCount = 12;
  private _bricks: BrickType[] = [];

  start() {
    this.generateBricks();
  }

  update(deltaTime: number) {}

  generateBricks() {
    this.node.removeAllChildren();

    for (let i = 0; i < this.brickCount; i++) {
      this._bricks.push(Math.floor(Math.random() * 2));
    }

    for (let i = 0; i < this._bricks.length; i++) {
      let brick: Node | null = this.spawnBrickByType(this._bricks[i]);
      if (brick) {
        this.node.addChild(brick);
        brick.setPosition(
          i * BRICK_SIZE + DIST_FROM_LEFT + DIST_BETWEEN * i,
          TOP_Y,
          0
        );
        let collider = brick.getComponent(BoxCollider2D);
        if (collider) {
          collider.apply();
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
