﻿(function($,sr){
  _Prtg = _Prtg || {};
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  _Prtg.debounce = function debounce(func, threshhold, execAsap) {
      var timeout;

      return function _debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          }
          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshhold || 100);
      };
  };
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', _Prtg.debounce(fn)) : this.trigger(sr); };

  // from Remy Sharp
  // https://remysharp.com/2010/07/21/throttling-function-calls
  _Prtg.throttle = function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function throttle() {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

})(jQuery,'debounce');
