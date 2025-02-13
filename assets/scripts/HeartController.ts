import {
  _decorator,
  BoxCollider2D,
  Component,
  Contact2DType,
  Node,
  RigidBody2D,
  Vec2,
  view,
} from "cc";
import { eventTarget, GameEvents } from "./GameEvents";
const { ccclass, property } = _decorator;

@ccclass("HeartController")
export class HeartController extends Component {
  start() {
    const collider = this.getComponent(BoxCollider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  update(deltaTime: number) {
    const pos = this.node.position;
    if (pos.y < 0) {
      this.node.destroy();
    }
  }

  onBeginContact(selfCol: BoxCollider2D, otherCol: BoxCollider2D) {
    if (otherCol.node.name === "Paddle") {
      this.scheduleOnce(() => {
        selfCol.node.destroy();
      });
      eventTarget.emit(GameEvents.GOT_LIFE);
    }
  }
}
