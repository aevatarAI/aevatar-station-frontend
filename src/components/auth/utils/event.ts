import EventEmitter from "events";

export const eventBus = new EventEmitter();

const EventList = ["AuthorizationExpired", "AuthorizationUpdated"] as const;

// eslint-disable-next-line no-new-func
const eventsServer = new Function();

eventsServer.prototype.parseEvent = function (
	name: string,
	eventMap: string[],
) {
	const obj: any = (this[name] = {});

	for (const item of eventMap) {
		const eventName = item.toLocaleUpperCase();
		obj[item] = {
			emit: this.emit.bind(this, eventName),
			addListener: this.addListener.bind(this, eventName),
			name: eventName,
		};
	}
};

eventsServer.prototype.emit = (eventType: string, ...params: any[]) => {
	eventBus.emit(eventType, ...params);
};
eventsServer.prototype.addListener = (
	eventType: string,
	listener: (data: any) => void,
) => {
	const cListener = eventBus.addListener(eventType, listener);
	return {
		...cListener,
		remove: () => eventBus.removeListener(eventType, listener),
	};
};

eventsServer.prototype.parseEvent("base", EventList);

export type MyEventEmitter = {
	remove: () => void;
} & EventEmitter;

export type MyEventsTypes = {
	[x in (typeof EventList)[number]]: {
		emit: (...params: any[]) => void;
		addListener: (listener: (data: any) => void) => MyEventEmitter;
		name: string;
	};
};

const myEvents = { ...eventsServer.prototype.base };

export default myEvents as unknown as MyEventsTypes;
