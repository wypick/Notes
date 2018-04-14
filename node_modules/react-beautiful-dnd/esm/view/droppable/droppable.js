import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _Droppable$contextTyp, _Droppable$childConte;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DroppableDimensionPublisher from '../droppable-dimension-publisher/';
import Placeholder from '../placeholder/';
import { droppableIdKey, styleContextKey } from '../context-keys';

var Droppable = function (_Component) {
  _inherits(Droppable, _Component);

  function Droppable(props, context) {
    _classCallCheck(this, Droppable);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

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

    _this.styleContext = context[styleContextKey];
    return _this;
  }

  Droppable.prototype.getChildContext = function getChildContext() {
    var _value;

    var value = (_value = {}, _value[droppableIdKey] = this.props.droppableId, _value);
    return value;
  };

  Droppable.prototype.getPlaceholder = function getPlaceholder() {
    if (!this.props.placeholder) {
      return null;
    }

    return React.createElement(Placeholder, { placeholder: this.props.placeholder });
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

    return React.createElement(
      DroppableDimensionPublisher,
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
}(Component);

Droppable.contextTypes = (_Droppable$contextTyp = {}, _Droppable$contextTyp[styleContextKey] = PropTypes.string.isRequired, _Droppable$contextTyp);
Droppable.childContextTypes = (_Droppable$childConte = {}, _Droppable$childConte[droppableIdKey] = PropTypes.string.isRequired, _Droppable$childConte);
export default Droppable;