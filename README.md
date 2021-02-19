# Method decorator to cache promises

## Example

```typescript
import { CacheDeferred } from '@shevsky/cache-deferred';

class Foo {
  private counter: number = 0;

  @CacheDeferred
  getDeferredValue(): Promise<number> {
    return this.resolveDeferredValue();
  }

  private resolveDeferredValue(): Promise<number> {
    return Promise.resolve(++this.counter);
  }
}

const foo = new Foo();

foo.getDeferredValue().then(console.log); // 1
foo.getDeferredValue().then(console.log); // 1
```

# Reset cache

```typescript
import { CacheDeferred } from '@shevsky/cache-deferred';

class Foo {
  counter: number = 0;
  
  @CacheDeferred.Reset('getDeferredValue')
  reset(): void {
    console.log('Called reset');
  }

  @CacheDeferred
  getDeferredValue(): Promise<number> {
    return this.resolveDeferredValue();
  }

  private resolveDeferredValue(): Promise<number> {
    return Promise.resolve(++this.counter);
  }
}

const foo = new Foo();

foo.getDeferredValue().then(console.log); // 1
foo.getDeferredValue().then(console.log); // 1
foo.reset();
foo.getDeferredValue().then(console.log); // 2
foo.getDeferredValue().then(console.log); // 2
```