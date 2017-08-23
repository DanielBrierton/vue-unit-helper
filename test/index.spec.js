var expect = require('chai').expect;
var sinon = require('sinon');
var vueUnitHelper = require('../index');

describe('Vue Unit Helper', function () {
  it('should make data, computed properties, methods and lifecycle methods available on the returned object', function () {
    // ARRANGE
    var input = {
      name: 'MyComponent',
      data: function () {
        return {
          myDataProp: 'myDataVal'
        };
      },
      computed: {
        myComputedProp: function () {
          return 'My Data Prop is ' + this.myDataProp;
        }
      },
      methods: {
      	myMethod: function () {} 
      },
      beforeCreated: function () {
        return 'beforeCreated ' + this.myDataProp;
      },
      beforeDestroy: function () {
        return 'beforeDestroy ' + this.myDataProp;
      },
      beforeMount: function () {
        return 'beforeMount ' + this.myDataProp;
      },
      beforeUpdate: function () {
        return 'beforeUpdate ' + this.myDataProp;
      },
      created: function () {
        return 'created ' + this.myDataProp;
      },
      destroy: function () {
        return 'destroy ' + this.myDataProp;
      },
      mounted: function () {
        return 'mounted ' + this.myDataProp;
      },
      updated: function () {
        return 'updated ' + this.myDataProp;
      }
    };

    // ACT
    var vm = vueUnitHelper(input);

    // ASSERT
    expect(vm.myDataProp).to.equal('myDataVal');
    expect(vm.myComputedProp).to.equal('My Data Prop is myDataVal');
    expect(vm.myMethod).to.equal(input.methods.myMethod);
    expect(vm.$lifecycleMethods.beforeCreated()).to.equal('beforeCreated myDataVal');
    expect(vm.$lifecycleMethods.beforeDestroy()).to.equal('beforeDestroy myDataVal');
    expect(vm.$lifecycleMethods.beforeMount()).to.equal('beforeMount myDataVal');
    expect(vm.$lifecycleMethods.beforeUpdate()).to.equal('beforeUpdate myDataVal');
    expect(vm.$lifecycleMethods.created()).to.equal('created myDataVal');
    expect(vm.$lifecycleMethods.destroy()).to.equal('destroy myDataVal');
    expect(vm.$lifecycleMethods.mounted()).to.equal('mounted myDataVal');
    expect(vm.$lifecycleMethods.updated()).to.equal('updated myDataVal');
  });

  it('should add any watchers to $watchers', function() {
    var input = {
      data: function () {
        return {
          myDataProp: 'myDataVal'
        };
      },
      watch: {
        myDataProp: function () {
          this.$emit('update:myDataProp', this.myDataProp)
        }
      }
    };
    var vm = vueUnitHelper(input);
    vm.$emit = sinon.stub();

    // ACT
    vm.$watchers.myDataProp();

    // ASSERT
    expect(vm.$emit.callCount).to.equal(1);
    expect(vm.$emit.calledWith('update:myDataProp', 'myDataVal')).to.equal(true);
  });

  it('should populate the returned object with default props', function () {
    var input = {
      props: {
        myProp: {
          default: 'myPropVal'
        },
        myOtherProp: String
      }
    };
    var vm = vueUnitHelper(input);

    // ASSERT
    expect(vm.myProp).to.equal('myPropVal');
    expect(vm.myOtherProp).to.be.undefined;
  });

  it('should allow mocking of a computed property', function () {
    // ARRANGE
    var input = {
      name: 'MyComponent',
      data: function () {
        return {
          myDataProp: 'myDataVal'
        };
      },
      computed: {
        myComputedProp: function () {
          return 'My Data Prop is ' + this.myDataProp;
        }
      }
    };
    var vm = vueUnitHelper(input);

    // ACT
    vm.myComputedProp = 'Computed prop has changed';

    // ASSERT
    expect(vm.myComputedProp).to.equal('Computed prop has changed');
  });

  it('should call the setter of a computed property when set', function () {
    var input = {
      data: function () {
        return {
          myDataProp: 'myDataVal'
        };
      },
      computed: {
        myComputedProp: {
          get: function () {
            return this.myDataProp;
          },
          set: function (val) {
            this.myDataProp = val;
          }
        }
      }
    };
    var vm = vueUnitHelper(input);

    // ACT
    vm.myComputedProp = 'myOtherDataVal';

    // ASSERT
    expect(vm.myDataProp).to.equal('myOtherDataVal');
  });

  it('should return updated computed property when data is changed', function () {
    // ARRANGE
    var input = {
      name: 'MyComponent',
      data: function () {
        return {
          myDataProp: 'myDataVal'
        };
      },
      computed: {
        myComputedProp: function () {
          return 'My Data Prop is ' + this.myDataProp;
        }
      }
    };
    var vm = vueUnitHelper(input);
    var originalResult = vm.myComputedProp;

    // ACT
    vm.myDataProp = 'myOtherDataVal';

    // ASSERT
    expect(originalResult).to.equal('My Data Prop is myDataVal');
    expect(vm.myComputedProp).to.equal('My Data Prop is myOtherDataVal');
  });

  it('should return a computed property value when getter is explicity set', function () {
    var input = {
      data: function () {
        return {
          myDataProp: 'myDataVal'
        };
      },
      computed: {
        myComputedProp: {
          get: function () {
            return 'My Data Prop is ' + this.myDataProp;
          },
          set: function (val) {
            this.myDataProp = val;
          }
        }
      }
    };
    var vm = vueUnitHelper(input);

    // ACT
    expect(vm.myComputedProp).to.equal('My Data Prop is myDataVal');
  });

  it('should allow you to mock one computed property in order to test another', function () {
    // ARRANGE
    var input = {
      data: function () {
        return {
          firstName: 'Foo',
          lastName: 'Bar'
        };
      },
      computed: {
        fullName() {
          return this.firstName + ' ' + this.lastName;
        },
        hello() {
          return 'Hello ' + this.fullName;
        }
      }
    };
    var vm = vueUnitHelper(input);
    vm.fullName = 'John Doe';

    // ASSERT
    expect(vm.hello).to.equal('Hello John Doe');
  });

  it('should work with components with no data function', function () {
    // ARRANGE
    var input = {
      name: 'MyComponent',
      props: ['myDataProp'],
      computed: {
        myComputedProp: function () {
          return 'My Data Prop is ' + this.myDataProp;
        }
      }
    };
    var vm = vueUnitHelper(input);
    vm.myDataProp = 'myDataVal'

    // ASSERT
    expect(vm.myComputedProp).to.equal('My Data Prop is myDataVal');
  });
});
