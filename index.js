var _ = require('lodash');

module.exports = function (vueDef) {
  var obj = typeof vueDef.data === 'function' ? _.clone(vueDef.data()) : {};
  _.each(vueDef.computed, function(fnDef, fnName) {
    Object.defineProperty(obj, fnName, {
      get: function () {
        return this.mockedData ? this.mockedData : fnDef.apply(obj);
      },
      set: function (val) {
        this.mockedData = val;
      },
      mockedData: null
    });
  });
  _.each(vueDef.methods, function(fnDef, fnName) {
    obj[fnName] = fnDef;
  });
  obj.$lifecycleMethods = {
    beforeCreated: vueDef.beforeCreated && vueDef.beforeCreated.bind(obj),
    created: vueDef.created && vueDef.created.bind(obj),
    beforeMount: vueDef.beforeMount && vueDef.beforeMount.bind(obj),
    mounted: vueDef.mounted && vueDef.mounted.bind(obj),
    beforeUpdate: vueDef.beforeUpdate && vueDef.beforeUpdate.bind(obj),
    updated: vueDef.updated && vueDef.updated.bind(obj),
    beforeDestroy: vueDef.beforeDestroy && vueDef.beforeDestroy.bind(obj),
    destroy: vueDef.destroy && vueDef.destroy.bind(obj)
  };
  return obj;
};