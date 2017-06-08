var _ = require('lodash');

module.exports = function (vueDef) {
  var obj = typeof vueDef.data === 'function' ? _.clone(vueDef.data()) : {};
  _.each(vueDef.computed, function(fnDef, fnName) {
    Object.defineProperty(obj, fnName, {
      get: function () {
        return this.mockedData ? this.mockedData : fnDef.get ? fnDef.get.apply(obj) : fnDef.apply(obj);
      },
      set: function (val) {
        if (fnDef.set) fnDef.set.apply(obj, [val]);
        this.mockedData = val;
      },
      mockedData: null
    });
  });
  _.each(vueDef.methods, function(fnDef, fnName) {
    obj[fnName] = fnDef;
  });
  if (vueDef.watch) {
    obj.$watchers = {};
    _.each(vueDef.watch, function(fnDef, fnName) {
      obj.$watchers[fnName] = fnDef.bind(obj);
    });
  }
  if (vueDef.props && vueDef.props.constructor === {}.constructor) {
    _.each(vueDef.props, function(propDef, propName) {
      if (propDef.default) {
        obj[propName] = typeof propDef.default === 'function' ? propDef.default() : propDef.default;
      }
    });
  }
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