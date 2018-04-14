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

var _DraggableDimensionPu;

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _memoizeOne = require('memoize-one');

var _memoizeOne2 = _interopRequireDefault(_memoizeOne);

var _getWindowScroll = require('../window/get-window-scroll');

var _getWindowScroll2 = _interopRequireDefault(_getWindowScroll);

var _dimension = require('../../state/dimension');

var _contextKeys = require('../context-keys');

var _getArea = require('../../state/get-area');

var _getArea2 = _interopRequireDefault(_getArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DraggableDimensionPublisher = function (_Component) {
  (0, _inherits3.default)(DraggableDimensionPublisher, _Component);

  function DraggableDimensionPublisher() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DraggableDimensionPublisher);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.publishedDescriptor = null, _this.getMemoizedDescriptor = (0, _memoizeOne2.default)(function (id, droppableId, index) {
      return {
        id: id,
        droppableId: droppableId,
        index: index
      };
    }), _this.unpublish = function () {
      if (!_this.publishedDescriptor) {
        console.error('cannot unpublish descriptor when none is published');
        return;
      }

      var marshal = _this.context[_contextKeys.dimensionMarshalKey];
      marshal.unregisterDraggable(_this.publishedDescriptor);
      _this.publishedDescriptor = null;
    }, _this.publish = function (descriptor) {
      if (descriptor === _this.publishedDescriptor) {
        return;
      }

      if (_this.publishedDescriptor) {
        _this.unpublish();
      }

      var marshal = _this.context[_contextKeys.dimensionMarshalKey];
      marshal.registerDraggable(descriptor, _this.getDimension);
      _this.publishedDescriptor = descriptor;
    }, _this.getDimension = function () {
      var targetRef = _this.props.targetRef;

      if (!targetRef) {
        throw new Error('DraggableDimensionPublisher cannot calculate a dimension when not attached to the DOM');
      }

      var descriptor = _this.publishedDescriptor;

      if (!descriptor) {
        throw new Error('Cannot get dimension for unpublished draggable');
      }

      var style = window.getComputedStyle(targetRef);

      var margin = {
        top: parseInt(style.marginTop, 10),
        right: parseInt(style.marginRight, 10),
        bottom: parseInt(style.marginBottom, 10),
        left: parseInt(style.marginLeft, 10)
      };

      var paddingBox = (0, _getArea2.default)(targetRef.getBoundingClientRect());

      var dimension = (0, _dimension.getDraggableDimension)({
        descriptor: descriptor,
        paddingBox: paddingBox,
        margin: margin,
        windowScroll: (0, _getWindowScroll2.default)()
      });

      return dimension;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  DraggableDimensionPublisher.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var draggableId = nextProps.draggableId,
        droppableId = nextProps.droppableId,
        index = nextProps.index,
        targetRef = nextProps.targetRef;


    if (!targetRef) {
      console.error('Updating draggable dimension handler without a targetRef');
      return;
    }

    var descriptor = this.getMemoizedDescriptor(draggableId, droppableId, index);

    this.publish(descriptor);
  };

  DraggableDimensionPublisher.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unpublish();
  };

  DraggableDimensionPublisher.prototype.render = function render() {
    return this.props.children;
  };

  return DraggableDimensionPublisher;
}(_react.Component);

DraggableDimensionPublisher.contextTypes = (_DraggableDimensionPu = {}, _DraggableDimensionPu[_contextKeys.dimensionMarshalKey] = _propTypes2.default.object.isRequired, _DraggableDimensionPu);
exports.default = DraggableDimensionPublisher;