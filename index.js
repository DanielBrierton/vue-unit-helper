var _ = require('lodash');

module.exports = function (vueDef) {
  var obj = _.clone(vueDef.data());
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
    beforeCreated: vueDef.beforeCreated,
    created: vueDef.created,
    beforeMount: vueDef.beforeMount,
    mounted: vueDef.mounted,
    beforeUpdate: vueDef.beforeUpdate,
    updated: vueDef.updated,
    beforeDestroy: vueDef.beforeDestroy,
    destroy: vueDef.destroy
  };
  return obj;
};