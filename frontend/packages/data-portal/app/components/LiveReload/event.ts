/**
 * Enum for different events in the live reload websocket.
 */
export enum LiveReloadEvent {
  Closed = 'live-reload-closed',
  Completed = 'live-reload-completed',
  Connected = 'live-reload-connected',
  Error = 'live-reload-error',
  Started = 'live-reload-started',
}
