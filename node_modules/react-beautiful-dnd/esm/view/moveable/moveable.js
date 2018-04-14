import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import { physics } from '../animation';


var origin = {
  x: 0,
  y: 0
};

var noMovement = {
  transform: null
};

var isAtOrigin = function isAtOrigin(point) {
  return point.x === origin.x && point.y === origin.y;
};

var getStyle = function getStyle(isNotMoving, x, y) {
  if (isNotMoving) {
    return noMovement;
  }

  var point = { x: x, y: y };

  if (isAtOrigin(point)) {
    return noMovement;
  }
  var style = {
    transform: 'translate(' + point.x + 'px, ' + point.y + 'px)'
  };
  return style;
};

var Movable = function (_Component) {
  _inherits(Movable, _Component);

  function Movable() {
    var _temp, _this, _ret;

    _classCallCheck(this, Movable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onRest = function () {
      var onMoveEnd = _this.props.onMoveEnd;


      if (!onMoveEnd) {
        return;
      }

      setTimeout(function () {
        return onMoveEnd();
      });
    }, _this.getFinal = function () {
      var destination = _this.props.destination;
      var speed = _this.props.speed;

      if (speed === 'INSTANT') {
        return destination;
      }

      var selected = speed === 'FAST' ? physics.fast : physics.standard;

      return {
        x: spring(destination.x, selected),
        y: spring(destination.y, selected)
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Movable.prototype.render = function render() {
    var _this2 = this;

    var final = this.getFinal();

    var isNotMoving = isAtOrigin(final);

    return React.createElement(
      Motion,
      { defaultStyle: origin, style: final, onRest: this.onRest },
      function (current) {
        return _this2.props.children(getStyle(isNotMoving, current.x, current.y));
      }
    );
  };

  return Movable;
}(Component);

Movable.defaultProps = {
  destination: origin
};
export default Movable;