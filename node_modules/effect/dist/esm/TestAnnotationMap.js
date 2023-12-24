/**
 * @since 2.0.0
 */
import { dual, pipe } from "./Function.js";
import { hasProperty } from "./Predicate.js";
/**
 * @since 2.0.0
 */
export const TestAnnotationMapTypeId = /*#__PURE__*/Symbol.for("effect/TestAnnotationMap");
/** @internal */
class TestAnnotationMapImpl {
  map;
  [TestAnnotationMapTypeId] = TestAnnotationMapTypeId;
  constructor(map) {
    this.map = map;
  }
}
/**
 * @since 2.0.0
 */
export const isTestAnnotationMap = u => hasProperty(u, TestAnnotationMapTypeId);
/**
 * @since 2.0.0
 */
export const empty = () => new TestAnnotationMapImpl(new Map());
/**
 * @since 2.0.0
 */
export const make = map => {
  return new TestAnnotationMapImpl(map);
};
/**
 * @since 2.0.0
 */
export const overwrite = /*#__PURE__*/dual(3, (self, key, value) => make(self.map.set(key, value)));
/**
 * @since 2.0.0
 */
export const update = /*#__PURE__*/dual(3, (self, key, f) => {
  let value = self.map.get(key);
  if (value === undefined) {
    value = key.initial;
  }
  return pipe(self, overwrite(key, f(value)));
});
/**
 * Retrieves the annotation of the specified type, or its default value if
 * there is none.
 *
 * @since 2.0.0
 */
export const get = /*#__PURE__*/dual(2, (self, key) => {
  const value = self.map.get(key);
  if (value === undefined) {
    return key.initial;
  }
  return value;
});
/**
 * Appends the specified annotation to the annotation map.
 *
 * @since 2.0.0
 */
export const annotate = /*#__PURE__*/dual(3, (self, key, value) => update(self, key, _ => key.combine(_, value)));
/**
 * @since 2.0.0
 */
export const combine = /*#__PURE__*/dual(2, (self, that) => {
  const result = new Map(self.map);
  for (const entry of that.map) {
    if (result.has(entry[0])) {
      const value = result.get(entry[0]);
      result.set(entry[0], entry[0].combine(value, entry[1]));
    } else {
      result.set(entry[0], entry[1]);
    }
  }
  return make(result);
});
//# sourceMappingURL=TestAnnotationMap.js.map