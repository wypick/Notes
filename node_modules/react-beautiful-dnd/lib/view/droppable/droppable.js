'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Droppable$contextTyp, _Droppable$childConte;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _droppableDimensionPublisher = require('../droppable-dimension-publisher/');

var _droppableDimensionPublisher2 = _interopRequireDefault(_droppableDimensionPublisher);

var _placeholder = require('../placeholder/');

var _placeholder2 = _interopRequireDefault(_placeholder);

var _contextKeys = require('../context-keys');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Droppable = function (_Component) {
  (0, _inherits3.default)(Droppable, _Component);

  function Droppable(props, context) {
    (0, _classCallCheck3.default)(this, Droppable);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, context));

    _this.state = {
      ref: null
    };

    _this.setRef = function (ref) {
      if (ref === null) {
        return;
      }

      if (ref === _this.state.ref) {
        return;
      }

      _this.setState({
        ref: ref
      });
    };

    _this.styleContext = context[_contextKeys.styleContextKey];
    return _this;
  }

  Droppable.prototype.getChildContext = function getChildContext() {
    var _value;

    var value = (_value = {}, _value[_contextKeys.droppableIdKey] = this.props.droppableId, _value);
    return value;
  };

  Droppable.prototype.getPlaceholder = function getPlaceholder() {
    if (!this.props.placeholder) {
      return null;
    }

    return _react2.default.createElement(_placeholder2.default, { placeholder: this.props.placeholder });
  };

  Droppable.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        direction = _props.direction,
        droppableId = _props.droppableId,
        ignoreContainerClipping = _props.ignoreContainerClipping,
        isDraggingOver = _props.isDraggingOver,
        isDropDisabled = _props.isDropDisabled,
        draggingOverWith = _props.draggingOverWith,
        type = _props.type;

    var provided = {
      innerRef: this.setRef,
      placeholder: this.getPlaceholder(),
      droppableProps: {
        'data-react-beautiful-dnd-droppable': this.styleContext
      }
    };
    var snapshot = {
      isDraggingOver: isDraggingOver,
      draggingOverWith: draggingOverWith
    };

    return _react2.default.createElement(
      _droppableDimensionPublisher2.default,
      {
        droppableId: droppableId,
        type: type,
        direction: direction,
        ignoreContainerClipping: ignoreContainerClipping,
        isDropDisabled: isDropDisabled,
        targetRef: this.state.ref
      },
      children(provided, snapshot)
    );
  };

  return Droppable;
}(_react.Component);

Droppable.contextTypes = (_Droppable$contextTyp = {}, _Droppable$contextTyp[_contextKeys.styleContextKey] = _propTypes2.default.string.isRequired, _Droppable$contextTyp);
Droppable.childContextTypes = (_Droppable$childConte = {}, _Droppable$childConte[_contextKeys.droppableIdKey] = _propTypes2.default.string.isRequired, _Droppable$childConte);
exports.default = Droppable;