import {
  _decorator,
  BoxCollider2D,
  Collider2D,
  Color,
  Component,
  Contact2DType,
  instantiate,
  ParticleSystem2D,
  Prefab,
  Sprite,
} from "cc";
import { eventTarget, GameEvents } from "./GameEvents";
const { ccclass, property } = _decorator;

@ccclass("BrickController")
export class BrickController extends Component {
  @property({ type: Prefab })
  public destrParticlesPrefab: Prefab | null = null;

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
        if (this.destrParticlesPrefab) {
          const particleNode = instantiate(this.destrParticlesPrefab);
          particleNode.setPosition(selfCol.node.worldPosition);
          selfCol.node.parent?.addChild(particleNode);
          const particles = particleNode.getComponent(ParticleSystem2D);
          if (particles) {
            particles.resetSystem();
            this.scheduleOnce(() => {
              particleNode.destroy();
            }, 0.1);
          }
        }

        this.scheduleOnce(() => {
          selfCol.node.destroy();
        });
        const worldPos = this.node.getWorldPosition();
        eventTarget.emit(GameEvents.BRICK_DESTROYED, {
          x: worldPos.x,
          y: worldPos.y,
        });
      }
    }
  }
}
