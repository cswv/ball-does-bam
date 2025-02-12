import {
  _decorator,
  Component,
  input,
  Input,
  EventKeyboard,
  RigidBody2D,
  Vec2,
  view,
  UITransform,
  KeyCode,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

export const PADDLE_VEL = 40;
const PADDLE_RESET_POSITION = new Vec3(0, -320, 0);

@ccclass("PaddleController")
export class PaddleController extends Component {
  private _movingDirs: number[] = [];
  private _rb: RigidBody2D = null;
  private _halfScreenWidth = 0;
  private _halfPaddleWidth = 0;

  start() {
    this._rb = this.getComponent(RigidBody2D);
    this._halfScreenWidth = view.getVisibleSize().width / 2;
    this._halfPaddleWidth =
      this.node.getComponent(UITransform).contentSize.width / 2;
  }

  setActive(active: boolean) {
    if (active) {
      this.node.setPosition(PADDLE_RESET_POSITION);
      input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
      input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    } else {
      input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
      input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
  }

  update(deltaTime: number) {
    if (this._movingDirs.length === 0) {
      this._rb.linearVelocity = new Vec2(0, 0);
    } else {
      const lastDir = this._movingDirs[this._movingDirs.length - 1];
      const pos = this.node.getPosition();
      const rightBound = this._halfScreenWidth - this._halfPaddleWidth;
      const leftBound = -this._halfScreenWidth + this._halfPaddleWidth;
      if (
        (pos.x >= rightBound && lastDir === 1) ||
        (pos.x <= leftBound && lastDir === -1)
      ) {
        this._rb.linearVelocity = new Vec2(0, 0);
      } else {
        this._rb.linearVelocity = new Vec2(lastDir * PADDLE_VEL, 0);
      }
    }
  }

  onKeyDown(event: EventKeyboard) {
    if (event.keyCode === KeyCode.ARROW_LEFT) {
      this._movingDirs.push(-1);
    } else if (event.keyCode === KeyCode.ARROW_RIGHT) {
      this._movingDirs.push(1);
    }
  }

  onKeyUp(event: EventKeyboard) {
    if (event.keyCode === KeyCode.ARROW_LEFT) {
      this._movingDirs = this._movingDirs.filter((d) => d !== -1);
    } else if (event.keyCode === KeyCode.ARROW_RIGHT) {
      this._movingDirs = this._movingDirs.filter((d) => d !== 1);
    }
  }
}
