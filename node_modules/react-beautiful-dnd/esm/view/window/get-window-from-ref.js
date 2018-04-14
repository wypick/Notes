
export default (function (ref) {
  return ref ? ref.ownerDocument.defaultView : window;
});