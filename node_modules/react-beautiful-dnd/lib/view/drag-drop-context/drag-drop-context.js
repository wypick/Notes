'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetServerContext = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DragDropContext$chil;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createStore = require('../../state/create-store');

var _createStore2 = _interopRequireDefault(_createStore);

var _hookCaller = require('../../state/hooks/hook-caller');

var _hookCaller2 = _interopRequireDefault(_hookCaller);

var _dimensionMarshal = require('../../state/dimension-marshal/dimension-marshal');

var _dimensionMarshal2 = _interopRequireDefault(_dimensionMarshal);

var _styleMarshal = require('../style-marshal/style-marshal');

var _styleMarshal2 = _interopRequireDefault(_styleMarshal);

var _canStartDrag = require('../../state/can-start-drag');

var _canStartDrag2 = _interopRequireDefault(_canStartDrag);

var _scrollWindow = require('../window/scroll-window');

var _scrollWindow2 = _interopRequireDefault(_scrollWindow);

var _announcer = require('../announcer/announcer');

var _announcer2 = _interopRequireDefault(_announcer);

var _autoScroller = require('../../state/auto-scroller');

var _autoScroller2 = _interopRequireDefault(_autoScroller);

var _contextKeys = require('../context-keys');

var _actionCreators = require('../../state/action-creators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resetServerContext = exports.resetServerContext = function resetServerContext() {
  (0, _styleMarshal.resetStyleContext)();
};

var DragDropContext = function (_React$Component) {
  (0, _inherits3.default)(DragDropContext, _React$Component);

  function DragDropContext() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DragDropContext);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.canLift = function (id) {
      return (0, _canStartDrag2.default)(_this.store.getState(), id);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  DragDropContext.prototype.getChildContext = function getChildContext() {
    var _ref;

    return _ref = {}, _ref[_contextKeys.storeKey] = this.store, _ref[_contextKeys.dimensionMarshalKey] = this.dimensionMarshal, _ref[_contextKeys.styleContextKey] = this.styleMarshal.styleContext, _ref[_contextKeys.canLiftContextKey] = this.canLift, _ref;
  };

  DragDropContext.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    this.store = (0, _createStore2.default)();

    this.announcer = (0, _announcer2.default)();

    this.hookCaller = (0, _hookCaller2.default)(this.announcer.announce);

    this.styleMarshal = (0, _styleMarshal2.default)();

    var callbacks = {
      cancel: function cancel() {
        _this2.store.dispatch((0, _actionCreators.clean)());
      },
      publishDraggable: function publishDraggable(dimension) {
        _this2.store.dispatch((0, _actionCreators.publishDraggableDimension)(dimension));
      },
      publishDroppable: function publishDroppable(dimension) {
        _this2.store.dispatch((0, _actionCreators.publishDroppableDimension)(dimension));
      },
      bulkPublish: function bulkPublish(droppables, draggables) {
        _this2.store.dispatch((0, _actionCreators.bulkPublishDimensions)(droppables, draggables));
      },
      updateDroppableScroll: function updateDroppableScroll(id, newScroll) {
        _this2.store.dispatch((0, _actionCreators.updateDroppableDimensionScroll)(id, newScroll));
      },
      updateDroppableIsEnabled: function updateDroppableIsEnabled(id, isEnabled) {
        _this2.store.dispatch((0, _actionCreators.updateDroppableDimensionIsEnabled)(id, isEnabled));
      }
    };
    this.dimensionMarshal = (0, _dimensionMarshal2.default)(callbacks);
    this.autoScroller = (0, _autoScroller2.default)({
      scrollWindow: _scrollWindow2.default,
      scrollDroppable: this.dimensionMarshal.scrollDroppable,
      move: function move(id, client, viewport, shouldAnimate) {
        _this2.store.dispatch((0, _actionCreators.move)(id, client, viewport, shouldAnimate));
      }
    });

    var previous = this.store.getState();

    this.unsubscribe = this.store.subscribe(function () {
      var current = _this2.store.getState();
      var previousInThisExecution = previous;
      var isPhaseChanging = current.phase !== previous.phase;

      previous = current;

      if (isPhaseChanging) {
        _this2.styleMarshal.onPhaseChange(current);
      }

      var isDragEnding = previousInThisExecution.phase === 'DRAGGING' && current.phase !== 'DRAGGING';

      if (isDragEnding) {
        _this2.dimensionMarshal.onPhaseChange(current);
      }

      var hooks = {
        onDragStart: _this2.props.onDragStart,
        onDragEnd: _this2.props.onDragEnd,
        onDragUpdate: _this2.props.onDragUpdate
      };
      _this2.hookCaller.onStateChange(hooks, previousInThisExecution, current);

      if (isPhaseChanging && !isDragEnding) {
        _this2.dimensionMarshal.onPhaseChange(current);
      }

      _this2.autoScroller.onStateChange(previousInThisExecution, current);
    });
  };

  DragDropContext.prototype.componentDidMount = function componentDidMount() {
    this.styleMarshal.mount();
    this.announcer.mount();
  };

  DragDropContext.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unsubscribe();
    this.styleMarshal.unmount();
    this.announcer.unmount();
  };

  DragDropContext.prototype.render = function render() {
    return this.props.children;
  };

  return DragDropContext;
}(_react2.default.Component);

DragDropContext.childContextTypes = (_DragDropContext$chil = {}, _DragDropContext$chil[_contextKeys.storeKey] = _propTypes2.default.shape({
  dispatch: _propTypes2.default.func.isRequired,
  subscribe: _propTypes2.default.func.isRequired,
  getState: _propTypes2.default.func.isRequired
}).isRequired, _DragDropContext$chil[_contextKeys.dimensionMarshalKey] = _propTypes2.default.object.isRequired, _DragDropContext$chil[_contextKeys.styleContextKey] = _propTypes2.default.string.isRequired, _DragDropContext$chil[_contextKeys.canLiftContextKey] = _propTypes2.default.func.isRequired, _DragDropContext$chil);
exports.default = DragDropContext;