"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.parse-int.js");

var _react = _interopRequireWildcard(require("react"));

var _requestAnimationNumber = require("request-animation-number");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Pager = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var _props$initialPage, _props$orientation, _props$touchGestures, _props$wheelScroll, _props$wheelScrollWit, _props$animationStyle, _props$duration, _props$loop, _props$showScrollbar, _props$ease;

  const pagerRef = (0, _react.useRef)();
  const currentPageRef = (0, _react.useRef)();
  const x = (0, _react.useRef)();
  const y = (0, _react.useRef)();
  const t = (0, _react.useRef)();
  const pos = (0, _react.useRef)();
  const isSwipe = (0, _react.useRef)();
  const isCanceled = (0, _react.useRef)();
  const initialPage = (_props$initialPage = props.initialPage) !== null && _props$initialPage !== void 0 ? _props$initialPage : 0;
  const orientation = (_props$orientation = props.orientation) !== null && _props$orientation !== void 0 ? _props$orientation : 'horizontal'; // 'vertical'

  const touchGestures = (_props$touchGestures = props.touchGestures) !== null && _props$touchGestures !== void 0 ? _props$touchGestures : true;
  const wheelScroll = (_props$wheelScroll = props.wheelScroll) !== null && _props$wheelScroll !== void 0 ? _props$wheelScroll : true;
  const wheelScrollAnimation = (_props$wheelScrollWit = props.wheelScrollWithAnimation) !== null && _props$wheelScrollWit !== void 0 ? _props$wheelScrollWit : true;
  const animationStyle = (_props$animationStyle = props.animationStyle) !== null && _props$animationStyle !== void 0 ? _props$animationStyle : 'scroll'; // 'opacity', 'scale', 'scaleX', 'scaleY'

  const duration = (_props$duration = props.duration) !== null && _props$duration !== void 0 ? _props$duration : 300;
  const loop = (_props$loop = props.loop) !== null && _props$loop !== void 0 ? _props$loop : false;
  const showScrollbar = (_props$showScrollbar = props.showScrollbar) !== null && _props$showScrollbar !== void 0 ? _props$showScrollbar : false;
  const easingFunction = (_props$ease = props.ease) !== null && _props$ease !== void 0 ? _props$ease : 'easeOutExpo';
  const onPageSelected = props.onPageSelected;
  const onAnimation = props.onAnimation;

  const wrapperStyle = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, orientation === 'vertical' ? {
    height: '50vh'
  } : null), props.wrapperStyle), orientation === 'vertical' ? {
    overflowY: showScrollbar ? 'scroll' : 'hidden'
  } : {
    overflowX: showScrollbar ? 'scroll' : 'hidden'
  }), {}, {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    flexWrap: 'nowrap',
    padding: '0px'
  });

  const [children, setChildren] = useStateCallback(props.children);
  const [, setCurrentPage] = (0, _react.useState)(initialPage);
  const [isFirstRender, setIsFirstRender] = (0, _react.useState)(true); // input duration and distance settings that determine fast swipe.

  const time_min = 75;
  const time_max = 300;
  const input_distance = 50;
  const swipe_direction_distance = 10;
  const changePage = (0, _react.useCallback)((page, withAnimation) => {
    var _page, _withAnimation, _currentPageRef$curre;

    page = (_page = page) !== null && _page !== void 0 ? _page : props.initialPage;
    withAnimation = (_withAnimation = withAnimation) !== null && _withAnimation !== void 0 ? _withAnimation : true;
    pos.current = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'];
    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl';
    const lastPage = (_currentPageRef$curre = currentPageRef.current) !== null && _currentPageRef$curre !== void 0 ? _currentPageRef$curre : 0;
    const pagerSize = parseInt(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
    const currentPos = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'];
    const children = pagerRef.current.children;
    const pagesCount = children.length;
    const maxScroll = pagesCount * pagerSize;
    const nextPos = isRtl ? -(page * pagerSize) : page * pagerSize;
    if (page === currentPageRef.current) return;

    if (page > pagesCount - 1 || page < 0) {
      console.error("react-js-pager: cannot find page with index ".concat(page));
      return;
    }

    if (nextPos < maxScroll) {
      if (withAnimation && animationStyle === 'scroll') {
        (0, _requestAnimationNumber.requestNum)({
          from: [currentPos, 0],
          to: [nextPos, 1],
          duration,
          easingFunction
        }, (s, a) => {
          var _pagerRef$current;

          pagerRef === null || pagerRef === void 0 ? void 0 : (_pagerRef$current = pagerRef.current) === null || _pagerRef$current === void 0 ? void 0 : _pagerRef$current.scrollTo(orientation === 'vertical' ? {
            top: s
          } : {
            left: s
          });
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: a,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          });
          if (s === nextPos) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage);
        });
      } else if (withAnimation && animationStyle === 'opacity') {
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: nextPos
        } : {
          left: nextPos
        });
        (0, _requestAnimationNumber.requestNum)({
          to: 1,
          duration,
          easingFunction
        }, o => {
          if (children !== null && children !== void 0 && children[page]) children[page].style.opacity = o;
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: o,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          });
          if (o === 1) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage);
        });
      } else if (withAnimation && animationStyle === 'scale') {
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: nextPos
        } : {
          left: nextPos
        });
        (0, _requestAnimationNumber.requestNum)({
          to: 1,
          duration,
          easingFunction
        }, s => {
          if (children !== null && children !== void 0 && children[page]) children[page].style.transform = "scale(".concat(s, ")");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: s,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          });
          if (s === 1) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage);
        });
      } else if (withAnimation && animationStyle === 'scaleX') {
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: nextPos
        } : {
          left: nextPos
        });
        (0, _requestAnimationNumber.requestNum)({
          to: 1,
          duration,
          easingFunction
        }, s => {
          if (children !== null && children !== void 0 && children[page]) children[page].style.transform = "scaleX(".concat(s, ")");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: s,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          });
          if (s === 1) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage);
        });
      } else if (withAnimation && animationStyle === 'scaleY') {
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: nextPos
        } : {
          left: nextPos
        });
        (0, _requestAnimationNumber.requestNum)({
          to: 1,
          duration,
          easingFunction
        }, s => {
          if (children !== null && children !== void 0 && children[page]) children[page].style.transform = "scaleY(".concat(s, ")");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: s,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          });
          if (s === 1) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage);
        });
      } else {
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: nextPos
        } : {
          left: nextPos
        });
        onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage);
      }

      setCurrentPage(page);
      currentPageRef.current = page;
    }
  }, [animationStyle, duration, easingFunction, onAnimation, onPageSelected, orientation, props.initialPage]);

  const adjustWidth = () => {
    const children = pagerRef.current.children;
    const pagerWidth = parseInt(window.getComputedStyle(pagerRef.current).width);

    for (let i = 0; i < children.length; i++) {
      const paddingLeft = parseInt(window.getComputedStyle(children[i]).paddingLeft);
      const paddingRight = parseInt(window.getComputedStyle(children[i]).paddingRight);
      const marginLeft = parseInt(window.getComputedStyle(children[i]).marginLeft);
      const marginRight = parseInt(window.getComputedStyle(children[i]).marginRight);
      const borderLeftWidth = parseInt(window.getComputedStyle(children[i]).borderLeftWidth);
      const borderRightWidth = parseInt(window.getComputedStyle(children[i]).borderRightWidth);
      children[i].style.minWidth = pagerWidth - (paddingLeft + paddingRight + marginLeft + marginRight + borderLeftWidth + borderRightWidth) + 'px';
    }
  };

  const adjustHeight = () => {
    const children = pagerRef.current.children;
    const pagerHeight = parseInt(window.getComputedStyle(pagerRef.current).height);

    for (let i = 0; i < children.length; i++) {
      const paddingTop = parseInt(window.getComputedStyle(children[i]).paddingTop);
      const paddingBottom = parseInt(window.getComputedStyle(children[i]).paddingBottom);
      const marginTop = parseInt(window.getComputedStyle(children[i]).marginTop);
      const marginBottom = parseInt(window.getComputedStyle(children[i]).marginBottom);
      const borderTopWidth = parseInt(window.getComputedStyle(children[i]).borderTopWidth);
      const borderBottomWidth = parseInt(window.getComputedStyle(children[i]).borderBottomWidth);
      children[i].style.minHeight = pagerHeight - (paddingTop + paddingBottom + marginTop + marginBottom + borderTopWidth + borderBottomWidth) + 'px';
    }
  };

  const onResizeHandle = () => {
    const page = currentPageRef.current;
    orientation === 'vertical' ? adjustHeight() : adjustWidth();
    const pagerSize = parseInt(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
    const nextPos = page * pagerSize;
    pagerRef.current.scrollTo(orientation === 'vertical' ? {
      top: nextPos
    } : {
      left: nextPos
    });
  };

  const onTouchEnd = e => {
    isSwipe.current = null;
    if (isCanceled.current) return;
    const touchX = e.changedTouches[0].pageX;
    const touchY = e.changedTouches[0].pageY;
    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl';
    const lastPage = currentPageRef.current;
    const size = parseInt(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
    const moving_distance = orientation === 'vertical' ? touchY - y.current : touchX - x.current;
    const moving_direction = moving_distance < 0 ? 'negative' : 'positive';
    const moving_time = Date.now() - t.current;
    const duration = 300;

    if (Math.abs(moving_distance) > size / 2 && moving_direction === 'negative' || moving_time > time_min && moving_time < time_max && Math.abs(moving_distance) > input_distance && moving_direction === 'negative') {
      const page = isRtl ? currentPageRef.current - 1 : currentPageRef.current + 1;
      if (page > pagerRef.current.children.length - 1) return;
      (0, _requestAnimationNumber.requestNum)({
        from: [pos.current - moving_distance, 0],
        to: [pos.current + size, 1],
        duration,
        easingFunction: 'easeOutExpo'
      }, (s, a) => {
        var _pagerRef$current2;

        pagerRef === null || pagerRef === void 0 ? void 0 : (_pagerRef$current2 = pagerRef.current) === null || _pagerRef$current2 === void 0 ? void 0 : _pagerRef$current2.scrollTo(orientation === 'vertical' ? {
          top: s
        } : {
          left: s
        });
        onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
          animationPercentage: a,
          selectedPageIndex: page,
          previousPageIndex: lastPage,
          touchSwipe: true
        });
        if (s === pos.current + size) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage);
      });
      setCurrentPage(page);
      currentPageRef.current = page;
    } else if (Math.abs(moving_distance) > size / 2 && moving_direction === 'positive' || moving_time > time_min && moving_time < time_max && Math.abs(moving_distance) > input_distance && moving_direction === 'positive') {
      const page = isRtl ? currentPageRef.current + 1 : currentPageRef.current - 1;
      if (page < 0) return;
      (0, _requestAnimationNumber.requestNum)({
        from: [pos.current - moving_distance, 0],
        to: [pos.current - size, 1],
        duration,
        easingFunction: 'easeOutExpo'
      }, (s, a) => {
        var _pagerRef$current3;

        pagerRef === null || pagerRef === void 0 ? void 0 : (_pagerRef$current3 = pagerRef.current) === null || _pagerRef$current3 === void 0 ? void 0 : _pagerRef$current3.scrollTo(orientation === 'vertical' ? {
          top: s
        } : {
          left: s
        });
        onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
          animationPercentage: a,
          selectedPageIndex: page,
          previousPageIndex: lastPage,
          touchSwipe: true
        });
        if (s === pos.current - size) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage);
      });
      setCurrentPage(page);
      currentPageRef.current = page;
    } else {
      (0, _requestAnimationNumber.requestNum)({
        from: [pos.current - moving_distance, 0],
        to: [pos.current, 1],
        duration,
        easingFunction: x => 1 + (0.8 + 1) * Math.pow(x - 1, 3) + 0.8 * Math.pow(x - 1, 2)
      }, (s, a) => {
        var _pagerRef$current4;

        pagerRef === null || pagerRef === void 0 ? void 0 : (_pagerRef$current4 = pagerRef.current) === null || _pagerRef$current4 === void 0 ? void 0 : _pagerRef$current4.scrollTo(orientation === 'vertical' ? {
          top: s
        } : {
          left: s
        });
        onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
          animationPercentage: a,
          selectedPageIndex: currentPageRef.current,
          previousPageIndex: currentPageRef.current,
          touchSwipe: true
        });
      });
    }

    pagerRef.current.removeEventListener('touchmove', onTouchMove);
  };

  const onTouchMove = e => {
    if (e.cancelable) e.preventDefault();
    const touchX = e.targetTouches[0].pageX;
    const touchY = e.targetTouches[0].pageY;
    const horizontal_distance = Math.abs(touchX - x.current);
    const verical_destance = Math.abs(touchY - y.current);
    isSwipe.current = isSwipe.current === true ? true : orientation === 'vertical' ? verical_destance > swipe_direction_distance : horizontal_distance > swipe_direction_distance;

    if ((orientation === 'vertical' ? horizontal_distance > swipe_direction_distance : verical_destance > swipe_direction_distance) && !isSwipe.current) {
      isCanceled.current = true;
      pagerRef.current.scrollTo(orientation === 'vertical' ? {
        top: pos.current
      } : {
        left: pos.current
      });
      pagerRef.current.removeEventListener('touchmove', onTouchMove);
      return;
    }

    let moveTo = pos.current - (orientation === 'vertical' ? touchY - y.current : touchX - x.current);
    pagerRef.current.scrollTo(orientation === 'vertical' ? {
      top: moveTo
    } : {
      left: moveTo
    });
  };

  const onTouchStart = e => {
    const touchX = e.targetTouches[0].pageX;
    const touchY = e.targetTouches[0].pageY;
    isCanceled.current = false;
    x.current = touchX;
    y.current = touchY;
    pos.current = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'];
    t.current = Date.now();
    pagerRef.current.addEventListener('touchmove', onTouchMove, {
      passive: false
    });
  };

  const onChildrenChange = (0, _react.useCallback)(() => {
    orientation === 'vertical' ? setChildren(props.children, () => adjustHeight()) : setChildren(props.children, () => adjustWidth());
  }, [orientation, props.children, setChildren]);
  (0, _react.useLayoutEffect)(() => {
    if (isFirstRender) {
      orientation === 'vertical' ? adjustHeight() : adjustWidth();
      changePage(initialPage, false);
      window.addEventListener('resize', onResizeHandle);
      setIsFirstRender(false);
    }

    onChildrenChange(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePage, onChildrenChange]);
  (0, _react.useEffect)(() => {
    return () => {
      window.removeEventListener('resize', onResizeHandle);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPage = (page, withAnimation) => changePage(page, withAnimation);

  const next = withAnimation => {
    if (loop) {
      const pagesCount = pagerRef.current.children.length - 1;
      const page = currentPageRef.current + 1 > pagesCount ? 0 : currentPageRef.current + 1;
      changePage(page, withAnimation);
    } else {
      changePage(Math.min(Math.max(currentPageRef.current + 1, 0), pagerRef.current.children.length - 1), withAnimation);
    }
  };

  const previous = withAnimation => {
    if (loop) {
      const pagesCount = pagerRef.current.children.length - 1;
      const page = currentPageRef.current - 1 < 0 ? pagesCount : currentPageRef.current - 1;
      changePage(page, withAnimation);
    } else {
      changePage(Math.min(Math.max(currentPageRef.current - 1, 0), pagerRef.current.children.length - 1), withAnimation);
    }
  };

  (0, _react.useImperativeHandle)(ref, () => ({
    next,
    previous,
    setPage
  }));

  const wheelHandle = e => e.deltaY > 0 ? next(wheelScrollAnimation) : previous(wheelScrollAnimation);

  const onScrollHandle = event => {
    var _props$onPagerScroll;

    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl';
    const pagerHeight = parseInt(window.getComputedStyle(pagerRef.current).height);
    const pagerWidth = parseInt(window.getComputedStyle(pagerRef.current).width);
    const scrollX = pagerRef.current.scrollLeft;
    const scrollY = pagerRef.current.scrollTop;
    const scrollHeight = pagerRef.current.scrollHeight;
    const scrollWidth = pagerRef.current.scrollWidth;
    const percentageX = isRtl ? -(scrollX / (scrollWidth - pagerWidth)) : scrollX / (scrollWidth - pagerWidth);
    const percentageY = isRtl ? -(scrollY / (scrollHeight - pagerHeight)) : scrollY / (scrollHeight - pagerHeight);
    (_props$onPagerScroll = props.onPagerScroll) === null || _props$onPagerScroll === void 0 ? void 0 : _props$onPagerScroll.call(props, {
      percentageX,
      percentageY,
      scrollX,
      scrollY,
      scrollHeight,
      scrollWidth,
      pagerWidth,
      pagerHeight,
      event
    });
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    ref: pagerRef,
    style: wrapperStyle,
    onTouchStart: touchGestures ? onTouchStart : null,
    onTouchEnd: touchGestures ? onTouchEnd : null,
    onWheel: wheelScroll ? wheelHandle : null,
    onScroll: props.onPagerScroll ? onScrollHandle : null
  }, children);
});

function useStateCallback(initialState) {
  const [state, setState] = (0, _react.useState)(initialState);
  const cbRef = (0, _react.useRef)(null); // init mutable ref container for callbacks

  const setStateCallback = (0, _react.useCallback)((state, cb) => {
    cbRef.current = cb; // store current, passed callback in ref

    setState(state);
  }, []); // keep object reference stable, exactly like `useState`

  (0, _react.useEffect)(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);
  return [state, setStateCallback];
}

var _default = Pager;
exports.default = _default;