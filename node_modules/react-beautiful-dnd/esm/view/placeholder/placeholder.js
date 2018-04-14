import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

import React, { PureComponent } from 'react';

var Placeholder = function (_PureComponent) {
  _inherits(Placeholder, _PureComponent);

  function Placeholder() {
    _classCallCheck(this, Placeholder);

    return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
  }

  Placeholder.prototype.render = function render() {
    var placeholder = this.props.placeholder;
    var _placeholder$margin = placeholder.margin,
        top = _placeholder$margin.top,
        left = _placeholder$margin.left,
        bottom = _placeholder$margin.bottom,
        right = _placeholder$margin.right;
    var _placeholder$paddingB = placeholder.paddingBox,
        width = _placeholder$paddingB.width,
        height = _placeholder$paddingB.height;


    var style = {
      width: width,
      height: height,
      marginTop: top,
      marginLeft: left,
      marginBottom: bottom,
      marginRight: right,
      pointerEvents: 'none',
      boxSizing: 'border-box'
    };
    return React.createElement('div', { style: style });
  };

  return Placeholder;
}(PureComponent);

export default Placeholder;