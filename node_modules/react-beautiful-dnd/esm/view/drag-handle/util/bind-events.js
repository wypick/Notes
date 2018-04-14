import _extends from 'babel-runtime/helpers/extends';


export var bindEvents = function bindEvents(el, bindings, sharedOptions) {
  bindings.forEach(function (binding) {
    var options = _extends({}, sharedOptions, binding.options);

    el.addEventListener(binding.eventName, binding.fn, options);
  });
};

export var unbindEvents = function unbindEvents(el, bindings, sharedOptions) {
  bindings.forEach(function (binding) {
    var options = _extends({}, sharedOptions, binding.options);

    el.removeEventListener(binding.eventName, binding.fn, options);
  });
};