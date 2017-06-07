[![CircleCI](https://img.shields.io/circleci/project/github/DanielBrierton/vue-unit-helper.svg)](https://circleci.com/gh/DanielBrierton/vue-unit-helper)
[![npm](https://img.shields.io/npm/v/vue-unit-helper.svg)](https://www.npmjs.com/package/vue-unit-helper)
[![npm](https://img.shields.io/npm/l/vue-unit-helper.svg)](https://www.npmjs.com/package/vue-unit-helper)

# vue-unit-helper
A helper function for unit testing Vue components

## Installation
`npm install --save-dev vue-unit-helper`

## Usage
Require vue-unit-helper into your test, and pass your Vue component definition into it. The object returned will allow you to directly access data properties, computed properties, methods, and lifecycle methods (under a $lifecycleMethods object).

### Example
Counter.vue

```html
<template>
  <p>2^{{ num }} = {{ twoToPowerOfNum }}</p>
  <button @click="increment">Increment</button>
  <button @click="decrement">Decrement</button>
</template>

<script>
  export default {
    name: 'Counter',
    data() {
    return {
        num: 0
      };
    },
    computed: {
      twoToPowerOfNum() {
        return Math.pow(2, this.num);
      }
    },
    methods: {
      increment() {
        this.num++;
      },
      decrement() {
        this.num--;
      }
    }
  };
</script>
```

Counter.spec.js
```javascript
import Counter from '@/Counter';
import vueUnitHelper from 'vue-unit-helper';

describe('Counter', () => {
  it('should set twoToPowerOfNum computed property to 2 to the power of num', () => {
    // ARRANGE
    const counter = vueUnitHelper(Counter);
    counter.num = 4;

    // ACT
    const result = counter.twoToPowerOfNum;

    // ASSERT
    expect(result).to.equal(16);
  });

  it('should change twoToPowerOfNum computed property when num is changed', () => {
    // ARRANGE
    const counter = vueUnitHelper(Counter);
    counter.num = 4;
    const originalResult = counter.twoToPowerOfNum;
    counter.num = 5;

    // ACT
    const newResult = counter.twoToPowerOfNum;

    // ASSERT
    expect(originalResult).to.equal(16);
    expect(newResult).to.equal(32);
  });

  it('should increment num', () => {
    // ARRANGE
    const counter = vueUnitHelper(Counter);
    counter.num = 4;

    // ACT
    this.increment();

    // ASSERT
    expect(counter.num).to.equal(5);
  });

  it('should increment num', () => {
    // ARRANGE
    const counter = vueUnitHelper(Counter);
    counter.num = 4;

    // ACT
    this.decrement();

    // ASSERT
    expect(counter.num).to.equal(3);
  });
});
```
