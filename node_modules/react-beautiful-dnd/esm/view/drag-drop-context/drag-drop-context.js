import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _DragDropContext$chil;

import React from 'react';
import PropTypes from 'prop-types';
import createStore from '../../state/create-store';
import createHookCaller from '../../state/hooks/hook-caller';
import createDimensionMarshal from '../../state/dimension-marshal/dimension-marshal';
import createStyleMarshal, { resetStyleContext } from '../style-marshal/style-marshal';
import canStartDrag from '../../state/can-start-drag';
import scrollWindow from '../window/scroll-window';
import createAnnouncer from '../announcer/announcer';

import createAutoScroller from '../../state/auto-scroller';

import { storeKey, dimensionMarshalKey, styleContextKey, canLiftContextKey } from '../context-keys';
import { clean, move as _move, publishDraggableDimension, publishDroppableDimension, updateDroppableDimensionScroll, updateDroppableDimensionIsEnabled, bulkPublishDimensions } from '../../state/action-creators';

export var resetServerContext = function resetServerContext() {
  resetStyleContext();
};

var DragDropContext = function (_React$Component) {
  _inherits(DragDropContext, _React$Component);

  function DragDropContext() {
    var _temp, _this, _ret;

    _classCallCheck(this, DragDropContext);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.canLift = function (id) {
      return canStartDrag(_this.store.getState(), id);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  DragDropContext.prototype.getChildContext = function getChildContext() {
    var _ref;

    return _ref = {}, _ref[storeKey] = this.store, _ref[dimensionMarshalKey] = this.dimensionMarshal, _ref[styleContextKey] = this.styleMarshal.styleContext, _ref[canLiftContextKey] = this.canLift, _ref;
  };

  DragDropContext.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    this.store = createStore();

    this.announcer = createAnnouncer();

    this.hookCaller = createHookCaller(this.announcer.announce);

    this.styleMarshal = createStyleMarshal();

    var callbacks = {
      cancel: function cancel() {
        _this2.store.dispatch(clean());
      },
      publishDraggable: function publishDraggable(dimension) {
        _this2.store.dispatch(publishDraggableDimension(dimension));
      },
      publishDroppable: function publishDroppable(dimension) {
        _this2.store.dispatch(publishDroppableDimension(dimension));
      },
      bulkPublish: function bulkPublish(droppables, draggables) {
        _this2.store.dispatch(bulkPublishDimensions(droppables, draggables));
      },
      updateDroppableScroll: function updateDroppableScroll(id, newScroll) {
        _this2.store.dispatch(updateDroppableDimensionScroll(id, newScroll));
      },
      updateDroppableIsEnabled: function updateDroppableIsEnabled(id, isEnabled) {
        _this2.store.dispatch(updateDroppableDimensionIsEnabled(id, isEnabled));
      }
    };
    this.dimensionMarshal = createDimensionMarshal(callbacks);
    this.autoScroller = createAutoScroller({
      scrollWindow: scrollWindow,
      scrollDroppable: this.dimensionMarshal.scrollDroppable,
      move: function move(id, client, viewport, shouldAnimate) {
        _this2.store.dispatch(_move(id, client, viewport, shouldAnimate));
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
}(React.Component);

DragDropContext.childContextTypes = (_DragDropContext$chil = {}, _DragDropContext$chil[storeKey] = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
}).isRequired, _DragDropContext$chil[dimensionMarshalKey] = PropTypes.object.isRequired, _DragDropContext$chil[styleContextKey] = PropTypes.string.isRequired, _DragDropContext$chil[canLiftContextKey] = PropTypes.func.isRequired, _DragDropContext$chil);
export default DragDropContext;