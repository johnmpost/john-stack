/**
 * @since 2.0.0
 */
import * as Context from "../Context.js";
import { globalValue } from "../GlobalValue.js";
import * as MutableRef from "../MutableRef.js";
/** @internal */
export const TracerTypeId = /*#__PURE__*/Symbol.for("effect/Tracer");
/** @internal */
export const make = options => ({
  [TracerTypeId]: TracerTypeId,
  ...options
});
/** @internal */
export const tracerTag = /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/Tracer"));
/** @internal */
export const spanTag = /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/ParentSpan"));
const ids = /*#__PURE__*/globalValue("effect/Tracer/SpanId.ids", () => MutableRef.make(0));
/** @internal */
export class NativeSpan {
  name;
  parent;
  context;
  links;
  startTime;
  _tag = "Span";
  spanId;
  traceId = "native";
  sampled = true;
  status;
  attributes;
  events = [];
  constructor(name, parent, context, links, startTime) {
    this.name = name;
    this.parent = parent;
    this.context = context;
    this.links = links;
    this.startTime = startTime;
    this.status = {
      _tag: "Started",
      startTime
    };
    this.attributes = new Map();
    this.spanId = `span${MutableRef.incrementAndGet(ids)}`;
  }
  end = (endTime, exit) => {
    this.status = {
      _tag: "Ended",
      endTime,
      exit,
      startTime: this.status.startTime
    };
  };
  attribute = (key, value) => {
    this.attributes.set(key, value);
  };
  event = (name, startTime, attributes) => {
    this.events.push([name, startTime, attributes ?? {}]);
  };
}
/** @internal */
export const nativeTracer = /*#__PURE__*/make({
  span: (name, parent, context, links, startTime) => new NativeSpan(name, parent, context, links, startTime),
  context: f => f()
});
/** @internal */
export const externalSpan = options => ({
  _tag: "ExternalSpan",
  spanId: options.spanId,
  traceId: options.traceId,
  sampled: options.sampled ?? true,
  context: options.context ?? Context.empty()
});
//# sourceMappingURL=tracer.js.map