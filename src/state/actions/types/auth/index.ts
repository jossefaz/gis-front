import {
  SetTokenAction,
  DestroyTokenAction,
  RefreshTokenAction,
} from "./actions";
export * from "./actionsTypes";

export type AuthActions =
  | SetTokenAction
  | DestroyTokenAction
  | RefreshTokenAction;
