import {Map} from "immutable"

export type Immutable<Obj> = {
  get<Key extends keyof Obj>(key: Key) : Obj[Key];
  set<Key extends keyof Obj>(key: Key, value: any) : Immutable<Obj>;
};

export function immutable<Obj>(obj: Obj) : Immutable<Obj> {
  return Map(obj);
};

export function immutableDeep<Obj>(obj: Obj) : Immutable<Obj> | undefined {
  if (obj === undefined) {
    return undefined;
  }
  let keys = Object.keys(obj);
  keys.forEach((key) => {
    let child = obj[key];
    if (typeof child !== "object") {
      return;
    }
    obj[key] = immutableDeep(child);
  });
  return immutable(obj);
};

