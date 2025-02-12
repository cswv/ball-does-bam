import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3, view } from "cc";
const { ccclass, property } = _decorator;

const BALL_RESET_POSITION = new Vec3(0, 0, 0);

@ccclass("BallController")
export class BallController extends Component {
  private _halfScreenWidth = 0;
  private _halfScreenHeight = 0;
  private _rb: RigidBody2D = null;

  start() {
    const screenSize = view.getVisibleSize();
    this._halfScreenHeight = screenSize.height / 2;
    this._halfScreenWidth = screenSize.width / 2;
    this._rb = this.node.getComponent(RigidBody2D);
    this.setRandomVel();
  }

  update(deltaTime: number) {
    const pos = this.node.position;
    if (pos.x < -this._halfScreenWidth || pos.y < -this._halfScreenHeight) {
      this.node.setPosition(BALL_RESET_POSITION);
      this.setRandomVel();
    }
  }

  setRandomVel() {
    const xVel = this.generateRandomVel(5, 20);
    const yVel = this.generateRandomVel(5, 20);
    if (this._rb) {
      this._rb.linearVelocity = new Vec2(xVel, yVel);
    }
  }

  generateRandomVel(min: number, max: number): number {
    const sign = Math.random() < 0.5 ? -1 : 1;
    return sign * Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
