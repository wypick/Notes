
import getArea from '../state/get-area';

export default (function (el) {
  return getArea(el.getBoundingClientRect()).center;
});