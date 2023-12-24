"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stack = void 0;
/** @internal */
class Stack {
  value;
  previous;
  constructor(value, previous) {
    this.value = value;
    this.previous = previous;
  }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map