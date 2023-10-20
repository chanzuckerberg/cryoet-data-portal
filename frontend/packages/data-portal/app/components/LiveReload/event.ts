export const LIVE_RELOAD_EVENT = 'live-reload-event'

export enum LiveReloadEventType {
  Closed = 'closed',
  Completed = 'completed',
  Connected = 'connected',
  Error = 'error',
  Started = 'started',
}

interface LiveReloadClosedEvent {
  type: LiveReloadEventType.Closed
  code: string
  message?: string
}

interface LiveReloadCompletedEvent {
  type: LiveReloadEventType.Completed
}

interface LiveReloadConnectedEvent {
  type: LiveReloadEventType.Connected
}

interface LiveReloadErrorEvent {
  type: LiveReloadEventType.Error
  message: string
  error: string
}

interface LiveReloadStartedEvent {
  type: LiveReloadEventType.Started
  action: 'created' | 'changed' | 'deleted'
  file: string
}

export type LiveReloadStartedEventData = Omit<LiveReloadStartedEvent, 'type'>

export type LiveReloadEvent =
  | LiveReloadClosedEvent
  | LiveReloadCompletedEvent
  | LiveReloadConnectedEvent
  | LiveReloadErrorEvent
  | LiveReloadStartedEvent
