import { EventTarget } from "cc";

export const eventTarget = new EventTarget();

export enum GameEvents {
  LOST_LIFE,
  GOT_SCORE,
  BRICK_DESTROYED,
}
