var expect = require('chai').expect;
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
});
