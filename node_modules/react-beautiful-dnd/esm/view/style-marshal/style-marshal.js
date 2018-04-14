
import memoizeOne from 'memoize-one';
import getStyles from './get-styles';


var count = 0;

var prefix = 'data-react-beautiful-dnd';

export var resetStyleContext = function resetStyleContext() {
  count = 0;
};

export default (function () {
  var context = '' + count++;
  var styles = getStyles(context);

  var state = {
    el: null
  };

  var setState = function setState(newState) {
    state = newState;
  };

  var setStyle = memoizeOne(function (proposed) {
    if (!state.el) {
      console.error('cannot set style of style tag if not mounted');
      return;
    }

    state.el.innerHTML = proposed;
  });

  var mount = function mount() {
    if (state.el) {
      console.error('Style marshal already mounted');
      return;
    }

    var el = document.createElement('style');
    el.type = 'text/css';

    el.setAttribute(prefix, context);
    var head = document.querySelector('head');

    if (!head) {
      throw new Error('Cannot find the head to append a style to');
    }

    head.appendChild(el);
    setState({
      el: el
    });

    setStyle(styles.resting);
  };

  var onPhaseChange = function onPhaseChange(current) {
    if (!state.el) {
      console.error('cannot update styles until style marshal is mounted');
      return;
    }

    var phase = current.phase;

    if (phase === 'DRAGGING') {
      setStyle(styles.dragging);
      return;
    }

    if (phase === 'DROP_ANIMATING') {
      if (!current.drop || !current.drop.pending) {
        console.error('Invalid state found in style-marshal');
        return;
      }

      var reason = current.drop.pending.result.reason;

      if (reason === 'DROP') {
        setStyle(styles.dropAnimating);
        return;
      }
      setStyle(styles.userCancel);
      return;
    }

    setStyle(styles.resting);
  };

  var unmount = function unmount() {
    if (!state.el) {
      console.error('Cannot unmount style marshal as it is already unmounted');
      return;
    }
    var previous = state.el;

    setState({
      el: null
    });

    if (!previous.parentNode) {
      console.error('Cannot unmount style marshal as cannot find parent');
      return;
    }

    previous.parentNode.removeChild(previous);
  };

  var marshal = {
    onPhaseChange: onPhaseChange,
    styleContext: context,
    mount: mount,
    unmount: unmount
  };

  return marshal;
});