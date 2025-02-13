import {
  _decorator,
  BoxCollider2D,
  Collider2D,
  Color,
  Component,
  Contact2DType,
  Node,
  Sprite,
} from "cc";
import { eventTarget, GameEvents } from "./GameEvents";
const { ccclass, property } = _decorator;

@ccclass("BrickController")
export class BrickController extends Component {
  start() {
    const collider = this.getComponent(BoxCollider2D);
    if (collider) {
      collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
  }

  update(deltaTime: number) {}

  onEndContact(selfCol: BoxCollider2D, otherCol: Collider2D) {
    if (otherCol.node.name === "Ball") {
      eventTarget.emit(GameEvents.GOT_SCORE);
      const sprite = selfCol.node.getComponent(Sprite);
      if (sprite.color.equals(Color.BLUE)) {
        sprite.color = Color.RED;
      } else {
        this.scheduleOnce(() => {
          selfCol.node.destroy();
        });
        eventTarget.emit(GameEvents.BRICK_DESTROYED);
      }
    }
  }
}
