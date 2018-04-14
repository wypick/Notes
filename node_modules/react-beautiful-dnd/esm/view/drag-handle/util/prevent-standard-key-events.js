var _preventedKeys;

import * as keyCodes from '../../key-codes';

var preventedKeys = (_preventedKeys = {}, _preventedKeys[keyCodes.enter] = true, _preventedKeys[keyCodes.tab] = true, _preventedKeys);

export default (function (event) {
  if (preventedKeys[event.keyCode]) {
    event.preventDefault();
  }
});