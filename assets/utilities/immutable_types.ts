import {Map} from "immutable"

export type Immutable<Obj> = {
  get<Key extends keyof Obj>(key: Key) : Obj[Key];
  set<Key extends keyof Obj>(key: Key, value: any) : Immutable<Obj>;
  delete<Key extends keyof Obj>(key: Key) : Immutable<Obj>;
  filter(predicate: (value?: any, key?: string, iterator?: any) => boolean, context?: any) : any; 
  find(predicate: (value?: any, key?: string, iterator?: any) => boolean, context?: any) : any;
  has(key: string) : boolean;
  forEach(sideEffect: (value?: any, key?: any, iterator?: any) => any, context?: any) : number;
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

