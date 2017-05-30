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
      beforeCreated: function () {},
      beforeDestroy: function () {},
      beforeMount: function () {},
      beforeUpdate: function () {},
      created: function () {},
      destroy: function () {},
      mounted: function () {},
      updated: function () {}
    };

    // ACT
    var vm = vueUnitHelper(input);

    // ASSERT
    expect(vm.myDataProp).to.equal('myDataVal');
    expect(vm.myComputedProp).to.equal('My Data Prop is myDataVal');
    expect(vm.myMethod).to.equal(input.methods.myMethod);
    expect(vm.$lifecycleMethods).to.deep.equal({
      beforeCreated: input.beforeCreated,
      beforeDestroy: input.beforeDestroy,
      beforeMount: input.beforeMount,
      beforeUpdate: input.beforeUpdate,
      created: input.created,
      destroy: input.destroy,
      mounted: input.mounted,
      updated: input.updated
    });
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
