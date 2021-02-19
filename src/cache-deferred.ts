const CACHE_DEFERRED_BUFFER_SYMBOL = Symbol('cache-deferred');

function CacheDeferred<T extends Array<unknown>, S extends unknown>(
  target: object,
  key: string,
  rawDescriptor: TypedPropertyDescriptor<(...args: T) => Promise<S>>
): TypedPropertyDescriptor<(...args: T) => Promise<S>> {
  const bufferSymbol = Symbol(`cache-deferred-${key}`);

  let descriptor = rawDescriptor;
  if (descriptor === void 0) {
    descriptor = Object.getOwnPropertyDescriptor(target, key) as TypedPropertyDescriptor<(...args: T) => Promise<S>>;
  }

  const originalMethod = descriptor.value;
  if (!originalMethod) {
    return descriptor;
  }

  if (!(CACHE_DEFERRED_BUFFER_SYMBOL in target)) {
    target[CACHE_DEFERRED_BUFFER_SYMBOL] = {};
  }

  target[CACHE_DEFERRED_BUFFER_SYMBOL][key] = bufferSymbol;

  descriptor.value = function wrap(this: { [bufferSymbol]: Record<string, Promise<S>> }, ...args: T): Promise<S> {
    if (!(bufferSymbol in this)) {
      this[bufferSymbol] = {};
    }

    const argsKey = JSON.stringify(args);
    if (argsKey in this[bufferSymbol]) {
      return this[bufferSymbol][argsKey];
    }

    this[bufferSymbol][argsKey] = originalMethod.apply(this, args);

    return this[bufferSymbol][argsKey];
  };

  return descriptor;
}

CacheDeferred.Reset = (method: string): MethodDecorator => {
  return (target: object, key: string, rawDescriptor: PropertyDescriptor): PropertyDescriptor => {
    let descriptor = rawDescriptor;
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor;
    }

    const originalMethod = descriptor.value as (...args: Array<unknown>) => unknown;
    if (!originalMethod) {
      return descriptor;
    }

    descriptor.value = function wrap(this: object, ...args: Array<unknown>): unknown {
      if (CACHE_DEFERRED_BUFFER_SYMBOL in this && method in this[CACHE_DEFERRED_BUFFER_SYMBOL]) {
        this[this[CACHE_DEFERRED_BUFFER_SYMBOL][method]] = {};
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

export { CacheDeferred };
