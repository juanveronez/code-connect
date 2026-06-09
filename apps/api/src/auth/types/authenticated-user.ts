/**
 * Shape of the object attached to `request.user` by the JWT strategy.
 * Single source of truth shared by the strategy, the `CurrentUser`
 * decorator and the controllers that consume it.
 */
export interface AuthenticatedUser {
  sub: string;
}
