import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventKeyboard,
  Vec3,
  EventMouse,
} from "cc";
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 40;

@ccclass("PaddleController")
export class PaddleController extends Component {
  private _curPos: Vec3 = new Vec3();
  private _movingDirs: ("L" | "R")[] = [];

  start() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  update(deltaTime: number) {
    const lastDir = this._movingDirs[this._movingDirs.length - 1];
    if (lastDir === "L") {
      this.node.getPosition(this._curPos);
      Vec3.add(this._curPos, this._curPos, new Vec3(100 * deltaTime, 0, 0));
      this.node.setPosition(this._curPos);
    } else if (lastDir === "R") {
      this.node.getPosition(this._curPos);
      Vec3.add(this._curPos, this._curPos, new Vec3(-100 * deltaTime, 0, 0));
      this.node.setPosition(this._curPos);
    }
  }

  onKeyDown(event: EventKeyboard) {
    if (event.keyCode === 39) {
      this._movingDirs.push("L");
      this.node.getPosition(this._curPos);
    } else if (event.keyCode === 37) {
      this._movingDirs.push("R");
      this.node.getPosition(this._curPos);
    }
  }

  onKeyUp(event: EventKeyboard) {
    if (event.keyCode === 39) {
      this._movingDirs = this._movingDirs.filter((d) => d !== "L");
    } else if (event.keyCode === 37) {
      this._movingDirs = this._movingDirs.filter((d) => d !== "R");
    }
  }
}
