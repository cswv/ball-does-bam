import {
  _decorator,
  CircleCollider2D,
  Collider2D,
  Color,
  Component,
  Contact2DType,
  Label,
  RigidBody2D,
  Sprite,
  Vec2,
  Vec3,
  view,
} from "cc";
const { ccclass, property } = _decorator;

const BALL_RESET_POSITION = new Vec3(0, 0, 0);
const MIN_VEL = 5;
const MAX_VEL = 30;

@ccclass("BallController")
export class BallController extends Component {
  @property({ type: Label })
  public scoreLabel: Label | null = null;
  private _halfScreenWidth = 0;
  private _halfScreenHeight = 0;
  private _rb: RigidBody2D = null;

  start() {
    const screenSize = view.getVisibleSize();
    this._halfScreenHeight = screenSize.height / 2;
    this._halfScreenWidth = screenSize.width / 2;
    this._rb = this.node.getComponent(RigidBody2D);

    const collider = this.getComponent(CircleCollider2D);
    if (collider) {
      collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
  }

  setActive(active: boolean) {
    if (active) {
      this._rb.linearVelocity = new Vec2(10, 10);
    } else {
      this.node.setPosition(BALL_RESET_POSITION);
      this._rb.linearVelocity = new Vec2(0, 0);
    }
  }

  update(deltaTime: number) {
    const pos = this.node.position;
    if (pos.x < -this._halfScreenWidth || pos.y < -this._halfScreenHeight) {
      this.node.setPosition(BALL_RESET_POSITION);
      this._rb.linearVelocity = new Vec2(10, 10);
    }
  }

  onEndContact(selfCol: CircleCollider2D, otherCol: Collider2D) {
    if (otherCol.node.name === "Brick") {
      this.scoreLabel.string = `${parseInt(this.scoreLabel.string) + 1}`;
      const sprite = otherCol.node.getComponent(Sprite);
      if (sprite.color.equals(Color.BLUE)) {
        sprite.color = Color.RED;
      } else {
        this.scheduleOnce(() => {
          otherCol.node.destroy();
        });
      }
    }

    this.makeVelComfortable();
  }

  makeVelComfortable() {
    const vel = this._rb.linearVelocity;
    if (Math.abs(vel.y) < MIN_VEL) {
      vel.y = vel.y > 0 ? MIN_VEL : -MIN_VEL;
    }
    if (Math.abs(vel.x) < MIN_VEL) {
      vel.x = vel.x > 0 ? MIN_VEL : -MIN_VEL;
    }
    if (Math.abs(vel.y) > MAX_VEL) {
      vel.y = vel.y > 0 ? MAX_VEL : -MAX_VEL;
    }
    if (Math.abs(vel.x) > MAX_VEL) {
      vel.x = vel.x > 0 ? MAX_VEL : -MAX_VEL;
    }
    this._rb.linearVelocity = vel;
  }
}
