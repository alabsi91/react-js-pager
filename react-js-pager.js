"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.parse-float.js");

require("core-js/modules/es.promise.js");

var _react = _interopRequireWildcard(require("react"));

var _requestAnimationNumber = require("request-animation-number");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Pager = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var _props$initialPage, _props$orientation, _props$touchGestures, _props$wheelScroll, _props$wheelScrollWit, _props$animationStyle, _props$perspective, _props$duration, _props$loop, _props$showScrollbar, _props$ease;

  const pagerRef = (0, _react.useRef)(); // pager wrapper element

  const currentPageRef = (0, _react.useRef)(); // currently selected page

  const x = (0, _react.useRef)(); // touch x coordinate

  const y = (0, _react.useRef)(); // touch Y coordinate

  const t = (0, _react.useRef)(); // touch delta time

  const pos = (0, _react.useRef)(); // scroll position

  const isSwipe = (0, _react.useRef)(); // for touch swipe

  const isCanceled = (0, _react.useRef)(); // cancel touch

  const scrollWidthTmp = (0, _react.useRef)(); // save scroll width temporary to be use for onScrollEvent

  const scrollHeightTmp = (0, _react.useRef)(); // save scroll height temporary to be use for onScrollEvent

  const isResizing = (0, _react.useRef)(false); // if browser window size is changing used to cancle animation and onScrollEvent

  const isMounted = (0, _react.useRef)(true); // use to cancle all animtions on unmount.
  // props

  const initialPage = (_props$initialPage = props.initialPage) !== null && _props$initialPage !== void 0 ? _props$initialPage : 0;
  const orientation = (_props$orientation = props.orientation) !== null && _props$orientation !== void 0 ? _props$orientation : 'horizontal'; // 'vertical'

  const touchGestures = (_props$touchGestures = props.touchGestures) !== null && _props$touchGestures !== void 0 ? _props$touchGestures : true;
  const wheelScroll = (_props$wheelScroll = props.wheelScroll) !== null && _props$wheelScroll !== void 0 ? _props$wheelScroll : true;
  const wheelScrollAnimation = (_props$wheelScrollWit = props.wheelScrollWithAnimation) !== null && _props$wheelScrollWit !== void 0 ? _props$wheelScrollWit : true;
  const animationStyle = (_props$animationStyle = props.animationStyle) !== null && _props$animationStyle !== void 0 ? _props$animationStyle : 'scroll'; // 'opacity', 'scale', 'scaleX', 'scaleY'

  const perspective = (_props$perspective = props.perspective) !== null && _props$perspective !== void 0 ? _props$perspective : 500;
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

  const [children, setChildren] = useStateCallback(props.children); // save childern in the state

  const [isFirstRender, setIsFirstRender] = (0, _react.useState)(true); // used to call methods on first mount
  // input duration and distance settings that determine fast swipe.

  const time_min = 75;
  const time_max = 300;
  const input_distance = 50;
  const swipe_direction_distance = 10; //this method used to change pages except in the case of a touch swipe.

  const changePage = (0, _react.useCallback)(
  /**
   * @param {Number} page The page index to navigate to.
   * @param {Boolean} withAnimation Wither to use animation or not while navigation.
   * @param {'previous' | 'next'} type Detrmine navigation direction used for 'rotate' animation style.
   */
  (page, withAnimation, type) => {
    var _page, _withAnimation, _currentPageRef$curre;

    isResizing.current = false; // used to cancle 'rotate' animation style when browser window size is changing

    page = (_page = page) !== null && _page !== void 0 ? _page : props.initialPage; // use initialPage index props if param is not given.

    withAnimation = (_withAnimation = withAnimation) !== null && _withAnimation !== void 0 ? _withAnimation : true; // use animation if withAnimation param is not given.

    pos.current = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft']; // get scroll position depends on the orientation prop.

    scrollHeightTmp.current = pagerRef.current.scrollHeight; // save scroll width temporary to be use for onScrollEvent.

    scrollWidthTmp.current = pagerRef.current.scrollWidth; // save scroll height temporary to be use for onScrollEvent.

    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl' && orientation !== 'vertical'; // check if pager wrapper element has right to left direction style only if the orientation prop is set to 'horizontal'.

    const lastPage = (_currentPageRef$curre = currentPageRef.current) !== null && _currentPageRef$curre !== void 0 ? _currentPageRef$curre : 0; // save current page index as the previouse page before navigation to the new one.

    const pagerSize = parseFloat(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']); // pager wrapper element width or height depends on the orientation prop.

    const currentPos = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft']; // pager wrapper element current scroll position depends on the orientation prop.

    const children = pagerRef.current.children; // pager wrapper element childrens elements as pages.

    const pagesCount = children.length; // how many pages pager has.

    const maxScroll = pagesCount * pagerSize; // I'm not sure why i didn't use scrollWidth or scrollheight instead.

    const navigateTo = isRtl ? -(page * pagerSize) : page * pagerSize; // calculate page scroll position that will be navigated to.

    if (page === currentPageRef.current) return; // exit if the new page index equals the current page index.

    if (page > pagesCount - 1 || page < 0) {
      // exit if the new page index does not exist, could happens when using setPage method with wrong pageIndex param.
      console.error("react-js-pager: cannot find page with index ".concat(page));
      return;
    } // navigate to the new page index with animation styles.


    if (navigateTo < maxScroll) {
      // scroll animation style
      if (withAnimation && animationStyle === 'scroll') {
        (0, _requestAnimationNumber.requestNum)({
          from: [currentPos, 0],
          to: [navigateTo, 1],
          duration,
          easingFunction
        }, (s, a) => {
          var _pagerRef$current;

          if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.

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
          }); // call onAnimation prop if exist on every frame.

          if (s === navigateTo) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
        }); // opacity animation style
      } else if (withAnimation && animationStyle === 'opacity') {
        // scroll to the next page index before starting the animation.
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: navigateTo
        } : {
          left: navigateTo
        }); // animate

        (0, _requestAnimationNumber.requestNum)({
          to: 1,
          duration,
          easingFunction
        }, o => {
          if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.

          if (children !== null && children !== void 0 && children[page]) children[page].style.opacity = o;
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: o,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          }); // call onAnimation prop if exist on every frame.

          if (o === 1) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
        }); // scale animation style
      } else if (withAnimation && animationStyle === 'scale') {
        // scroll to the next page index before starting the animation.
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: navigateTo
        } : {
          left: navigateTo
        }); // animate

        (0, _requestAnimationNumber.requestNum)({
          to: 1,
          duration,
          easingFunction
        }, s => {
          if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.

          if (children !== null && children !== void 0 && children[page]) children[page].style.transform = "scale(".concat(s, ")");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: s,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          }); // call onAnimation prop if exist on every frame.

          if (s === 1) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
        }); // scaleX animation style
      } else if (withAnimation && animationStyle === 'scaleX') {
        // scroll to the next page index before starting the animation.
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: navigateTo
        } : {
          left: navigateTo
        }); // animate

        (0, _requestAnimationNumber.requestNum)({
          to: 1,
          duration,
          easingFunction
        }, s => {
          if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.

          if (children !== null && children !== void 0 && children[page]) children[page].style.transform = "scaleX(".concat(s, ")");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: s,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          }); // call onAnimation prop if exist on every frame.

          if (s === 1) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
        }); // scaleY animation style
      } else if (withAnimation && animationStyle === 'scaleY') {
        // scroll to the next page index before starting the animation.
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: navigateTo
        } : {
          left: navigateTo
        }); // animate

        (0, _requestAnimationNumber.requestNum)({
          to: 1,
          duration,
          easingFunction
        }, s => {
          if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.

          if (children !== null && children !== void 0 && children[page]) children[page].style.transform = "scaleY(".concat(s, ")");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: s,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          }); // call onAnimation prop if exist on every frame.

          if (s === 1) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
        }); // rotateY animation style
      } else if (withAnimation && animationStyle === 'rotateY') {
        // animate
        (0, _requestAnimationNumber.requestNum)({
          from: [0, 0],
          to: [180, 1],
          duration,
          easingFunction
        }, (r, o) => {
          if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
          // cancel animation if browser window size is changing to prevent incorrect arrangement of pages to happens.

          if (isResizing.current) {
            if (children !== null && children !== void 0 && children[lastPage]) children[lastPage].style.removeProperty('transform'); // clean up

            if (children !== null && children !== void 0 && children[page]) children[page].style.removeProperty('transform'); // clean up

            onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
              animationPercentage: 1,
              selectedPageIndex: page,
              previousPageIndex: lastPage,
              touchSwipe: false
            }); // call last frame

            return;
          } // rotate current page from 0deg to 90deg.


          if (children !== null && children !== void 0 && children[lastPage] && r <= 90) children[lastPage].style.transform = "perspective(".concat(perspective, "px) rotateY(").concat(type === 'previous' ? -r : r, "deg)"); // when the animation is half way scroll to the new page.

          if (r >= 90 && pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'] !== navigateTo) {
            pagerRef.current.scrollTo(orientation === 'vertical' ? {
              top: navigateTo
            } : {
              left: navigateTo
            });
            if (children !== null && children !== void 0 && children[lastPage]) children[lastPage].style.removeProperty('transform'); // clean up
          } // rotate the new page from 90deg to 180deg.


          if (children !== null && children !== void 0 && children[page] && r >= 90) children[page].style.transform = "perspective(".concat(perspective, "px) rotateY(").concat(type === 'previous' ? -r : r, "deg) scaleX(-1)");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: o,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          }); // call onAnimation prop if exist on every frame.
          // when the animation finishes.

          if (o === 1) {
            onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.

            if (children !== null && children !== void 0 && children[page]) children[page].style.removeProperty('transform'); // clean up
          }
        }); // rotateX animation style
      } else if (withAnimation && animationStyle === 'rotateX') {
        // animate
        (0, _requestAnimationNumber.requestNum)({
          from: [0, 0],
          to: [180, 1],
          duration,
          easingFunction
        }, (r, o) => {
          if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
          // cancel animation if browser window size is changing to prevent incorrect arrangement of pages to happens.

          if (isResizing.current) {
            if (children !== null && children !== void 0 && children[lastPage]) children[lastPage].style.removeProperty('transform'); // clean up

            if (children !== null && children !== void 0 && children[page]) children[page].style.removeProperty('transform'); // clean up

            onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
              animationPercentage: 1,
              selectedPageIndex: page,
              previousPageIndex: lastPage,
              touchSwipe: false
            }); // call last frame

            return;
          } // rotate current page from 0deg to 90deg.


          if (children !== null && children !== void 0 && children[lastPage] && r <= 90) children[lastPage].style.transform = "perspective(".concat(perspective, "px) rotateX(").concat(type === 'previous' ? -r : r, "deg)"); // when the animation is half way scroll to the new page.

          if (r >= 90 && pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'] !== navigateTo) {
            pagerRef.current.scrollTo(orientation === 'vertical' ? {
              top: navigateTo
            } : {
              left: navigateTo
            });
            if (children !== null && children !== void 0 && children[lastPage]) children[lastPage].style.removeProperty('transform'); // clean up
          } // rotate the new page from 90deg to 180deg.


          if (children !== null && children !== void 0 && children[page] && r >= 90) children[page].style.transform = "perspective(".concat(perspective, "px) rotateX(").concat(type === 'previous' ? -r : r, "deg) scaleY(-1)");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: o,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          }); // call onAnimation prop if exist on every frame.
          // when the animation finishes.

          if (o === 1) {
            onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.

            if (children !== null && children !== void 0 && children[page]) children[page].style.removeProperty('transform'); // clean up
          }
        }); // blur animation style
      } else if (withAnimation && animationStyle === 'blur') {
        // scroll to the next page index before starting the animation.
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: navigateTo
        } : {
          left: navigateTo
        }); // animate

        (0, _requestAnimationNumber.requestNum)({
          from: [20, 0],
          to: [0, 1],
          duration,
          easingFunction
        }, (b, o) => {
          if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.

          if (children !== null && children !== void 0 && children[page]) children[page].style.filter = "blur(".concat(b, "px)");
          onAnimation === null || onAnimation === void 0 ? void 0 : onAnimation({
            animationPercentage: o,
            selectedPageIndex: page,
            previousPageIndex: lastPage,
            touchSwipe: false
          }); // call onAnimation prop if exist on every frame.
          // when the animation finishes.

          if (o === 1) {
            onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.

            if (children !== null && children !== void 0 && children[page]) children[page].style.removeProperty('filter'); // clean up
          }
        }); // navigate to the new page index without any animation.
      } else {
        pagerRef.current.scrollTo(orientation === 'vertical' ? {
          top: navigateTo
        } : {
          left: navigateTo
        }); // scroll to the next page index

        onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
      }

      currentPageRef.current = page; // set the current page index to the new page index.
    }
  }, [animationStyle, duration, easingFunction, onAnimation, onPageSelected, orientation, perspective, props.initialPage]);

  const wait = time => new Promise(e => setTimeout(e, time)); // change every page width to fit the page wrapper element (orientation === 'horizontal')


  const adjustWidth = () => {
    const children = pagerRef.current.children;
    const pagerWidth = parseFloat(window.getComputedStyle(pagerRef.current).width);

    for (let i = 0; i < children.length; i++) {
      const paddingLeft = parseFloat(window.getComputedStyle(children[i]).paddingLeft);
      const paddingRight = parseFloat(window.getComputedStyle(children[i]).paddingRight);
      const marginLeft = parseFloat(window.getComputedStyle(children[i]).marginLeft);
      const marginRight = parseFloat(window.getComputedStyle(children[i]).marginRight);
      const borderLeftWidth = parseFloat(window.getComputedStyle(children[i]).borderLeftWidth);
      const borderRightWidth = parseFloat(window.getComputedStyle(children[i]).borderRightWidth);
      children[i].style.minWidth = pagerWidth - (paddingLeft + paddingRight + marginLeft + marginRight + borderLeftWidth + borderRightWidth) + 'px';
    }
  }; // change every page height to fit the page wrapper element (orientation === 'vertical').


  const adjustHeight = () => {
    const children = pagerRef.current.children;
    const pagerHeight = parseFloat(window.getComputedStyle(pagerRef.current).height);

    for (let i = 0; i < children.length; i++) {
      const paddingTop = parseFloat(window.getComputedStyle(children[i]).paddingTop);
      const paddingBottom = parseFloat(window.getComputedStyle(children[i]).paddingBottom);
      const marginTop = parseFloat(window.getComputedStyle(children[i]).marginTop);
      const marginBottom = parseFloat(window.getComputedStyle(children[i]).marginBottom);
      const borderTopWidth = parseFloat(window.getComputedStyle(children[i]).borderTopWidth);
      const borderBottomWidth = parseFloat(window.getComputedStyle(children[i]).borderBottomWidth);
      children[i].style.minHeight = pagerHeight - (paddingTop + paddingBottom + marginTop + marginBottom + borderTopWidth + borderBottomWidth) + 'px';
    }
  }; // wait a little bit of time to change pages size on the first render, I'm not sure way this is a thing should i do to make it work.


  const adjustSize = async () => {
    await wait(75);
    orientation === 'vertical' ? adjustHeight() : adjustWidth();
  }; // change pages size and adjust current scroll position when browser window size is changing.


  const onResizeHandle = () => {
    isResizing.current = true;
    const page = currentPageRef.current;
    orientation === 'vertical' ? adjustHeight() : adjustWidth();
    const pagerSize = parseFloat(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
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
    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl' && orientation !== 'vertical';
    const lastPage = currentPageRef.current;
    const size = parseFloat(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
    const moving_distance = orientation === 'vertical' ? touchY - y.current : touchX - x.current;
    const moving_direction = moving_distance < 0 ? 'negative' : 'positive';
    const moving_time = Date.now() - t.current;
    const duration = 300; // swipe to the right, (left in case of direction is right to left (rtl) and the orientation prop is 'horizontal')

    if (Math.abs(moving_distance) > size / 2 && moving_direction === 'negative' || moving_time > time_min && moving_time < time_max && Math.abs(moving_distance) > input_distance && moving_direction === 'negative') {
      const page = isRtl ? currentPageRef.current - 1 : currentPageRef.current + 1; // new page index depends on RTL.

      const navigateTo = isRtl ? -(page * size) : page * size; // new page position depends on RTL.

      if (!isRtl && page > pagerRef.current.children.length - 1 || isRtl && page < 0) return; // exit if there is nothing to swipe to.
      // animate

      (0, _requestAnimationNumber.requestNum)({
        from: [pos.current - moving_distance, 0],
        to: [navigateTo, 1],
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
        }); // call onAnimation prop if exist on every frame.

        if (s === pos.current + size) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
      });
      currentPageRef.current = page; // set the current page index to the new page index.
      // swipe to the left, (right in case of direction is right to left (rtl) and the orientation prop is 'horizontal')
    } else if (Math.abs(moving_distance) > size / 2 && moving_direction === 'positive' || moving_time > time_min && moving_time < time_max && Math.abs(moving_distance) > input_distance && moving_direction === 'positive') {
      const page = isRtl ? currentPageRef.current + 1 : currentPageRef.current - 1; // new page index depends on RTL.

      const navigateTo = isRtl ? -(page * size) : page * size; // new page position depends on RTL.

      if (!isRtl && page < 0 || isRtl && page > pagerRef.current.children.length - 1) return; // exit if there is nothing to swipe to.
      // animate

      (0, _requestAnimationNumber.requestNum)({
        from: [pos.current - moving_distance, 0],
        to: [navigateTo, 1],
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
        }); // call onAnimation prop if exist on every frame.

        if (s === pos.current - size) onPageSelected === null || onPageSelected === void 0 ? void 0 : onPageSelected(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
      });
      currentPageRef.current = page; // set the current page index to the new page index.
      // not enough swipe, return to the current page.
    } else {
      // animate
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
        }); // call onAnimation prop if exist on every frame.
      });
    }

    pagerRef.current.removeEventListener('touchmove', onTouchMove);
  };

  const onTouchMove = e => {
    if (e.cancelable) e.preventDefault();
    const touchX = e.targetTouches[0].pageX;
    const touchY = e.targetTouches[0].pageY;
    const horizontal_distance = Math.abs(touchX - x.current);
    const verical_destance = Math.abs(touchY - y.current); // check if the touch swipe is for scrolling or for navigating to new page.

    isSwipe.current = isSwipe.current === true ? true : orientation === 'vertical' ? verical_destance > swipe_direction_distance : horizontal_distance > swipe_direction_distance; // cancel page touch navigation in favour of touch scrolling (inside page wrapper element only).

    if ((orientation === 'vertical' ? horizontal_distance > swipe_direction_distance : verical_destance > swipe_direction_distance) && !isSwipe.current) {
      isCanceled.current = true;
      pagerRef.current.scrollTo(orientation === 'vertical' ? {
        top: pos.current
      } : {
        left: pos.current
      }); // reset current page poistion.

      pagerRef.current.removeEventListener('touchmove', onTouchMove);
      return;
    }

    let moveTo = pos.current - (orientation === 'vertical' ? touchY - y.current : touchX - x.current); // calculate touch move tracking value.

    pagerRef.current.scrollTo(orientation === 'vertical' ? {
      top: moveTo
    } : {
      left: moveTo
    });
  };

  const onTouchStart = e => {
    isResizing.current = false;
    scrollHeightTmp.current = pagerRef.current.scrollHeight;
    scrollWidthTmp.current = pagerRef.current.scrollWidth;
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
  }; // readjust if pages elements are changed.


  const onChildrenChange = (0, _react.useCallback)(() => {
    setChildren(props.children, () => adjustSize()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.children]); // wait a little bit of time to set initial page the first render, I'm not sure way this is a thing should i do to make it work.

  const setInitialPage = async () => {
    await wait(100);
    changePage(initialPage, false);
  };

  (0, _react.useLayoutEffect)(() => {
    if (isFirstRender) {
      window.addEventListener('resize', onResizeHandle);
      setInitialPage(); // navigate to initialPage index prop.

      setIsFirstRender(false);
    }

    onChildrenChange(); // add pages and adjust their sizes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePage, onChildrenChange]);
  (0, _react.useEffect)(() => {
    return () => {
      isMounted.current = false;
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
      changePage(page, withAnimation, 'previous');
    } else {
      changePage(Math.min(Math.max(currentPageRef.current - 1, 0), pagerRef.current.children.length - 1), withAnimation, 'previous');
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

    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl' && orientation !== 'vertical';
    const pagerHeight = parseFloat(window.getComputedStyle(pagerRef.current).height);
    const pagerWidth = parseFloat(window.getComputedStyle(pagerRef.current).width);
    const scrollX = pagerRef.current.scrollLeft;
    const scrollY = pagerRef.current.scrollTop;
    const scrollHeight = pagerRef.current.scrollHeight;
    const scrollWidth = pagerRef.current.scrollWidth;
    const percentageX = isRtl ? -(scrollX / (scrollWidthTmp.current - pagerWidth)) : scrollX / (scrollWidthTmp.current - pagerWidth);
    const percentageY = isRtl ? -(scrollY / (scrollHeightTmp.current - pagerHeight)) : scrollY / (scrollHeightTmp.current - pagerHeight);
    if (!isResizing.current) (_props$onPagerScroll = props.onPagerScroll) === null || _props$onPagerScroll === void 0 ? void 0 : _props$onPagerScroll.call(props, {
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
}); // custom react hook, I get it from Stack Overflow website.

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