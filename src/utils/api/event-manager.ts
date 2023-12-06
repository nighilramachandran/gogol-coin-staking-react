import { EventEmitter } from "events"

export const EVENT_UNAUTHORIZED = "event-unauthorized"

const eventManager = new EventEmitter()
export default eventManager
