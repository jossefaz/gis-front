import { SetTokenAction, DestroyTokenAction } from "./actions";
export * from "./actionsTypes";

export type AuthActions = SetTokenAction | DestroyTokenAction;
