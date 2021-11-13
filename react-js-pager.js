import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { requestNum } from 'request-animation-number';

const Pager = forwardRef((props, ref) => {
  const pagerRef = useRef(); // pager wrapper element
  const currentPageRef = useRef(); // currently selected page
  const x = useRef(); // touch x coordinate
  const y = useRef(); // touch Y coordinate
  const t = useRef(); // touch delta time
  const pos = useRef(); // scroll position
  const isSwipe = useRef(); // for touch swipe
  const isCanceled = useRef(); // cancel touch
  const scrollWidthTmp = useRef(); // save scroll width temporary to be use for onScrollEvent
  const scrollHeightTmp = useRef(); // save scroll height temporary to be use for onScrollEvent
  const isResizing = useRef(false); // if browser window size is changing used to cancle animation and onScrollEvent
  const isMounted = useRef(true); // use to cancle all animtions on unmount.
  const resizeObserver = useRef(); // resize event listiner for pager wrapper element.
  const isAnimationRunning = useRef(false); // used to stop resize event when the animation is still running to prevent unstabel behaviour.

  // props
  const initialPage = props.initialPage ?? 0;
  const orientation = props.orientation ?? 'horizontal'; // 'vertical'
  const touchGestures = props.touchGestures ?? true;
  const wheelScroll = props.wheelScroll ?? true;
  const wheelScrollAnimation = props.wheelScrollWithAnimation ?? true;
  const animationStyle = props.animationStyle ?? 'scroll'; // 'opacity', 'scale', 'scaleX', 'scaleY', 'rotateX', 'rotateY', blur
  const perspective = props.perspective ?? 500;
  const duration = props.duration ?? 300;
  const loop = props.loop ?? false;
  const showScrollbar = props.showScrollbar ?? false;
  const easingFunction = props.ease ?? 'easeOutExpo';
  const onNavigationStart = props.onNavigationStart;
  const onPageSelected = props.onPageSelected;
  const onAnimation = props.onAnimation;

  const wrapperStyle = {
    ...(orientation === 'vertical' ? { height: '50vh' } : null),
    ...props.wrapperStyle,
    ...(orientation === 'vertical'
      ? { overflowY: showScrollbar ? 'scroll' : 'hidden' }
      : { overflowX: showScrollbar ? 'scroll' : 'hidden' }),
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    flexWrap: 'nowrap',
    padding: '0px',
  };

  const checkTypes = () => {
    if (typeof initialPage !== 'number' || initialPage < 0) console.error('react-js-pager: props.initialPage has invalid value.');
    if (orientation !== 'horizontal' && orientation !== 'vertical')
      console.error('react-js-pager: props.orientation has invalid value.');
    if (typeof touchGestures !== 'boolean') console.error('react-js-pager: props.touchGestures has invalid value.');
    if (typeof wheelScroll !== 'boolean') console.error('react-js-pager: props.wheelScroll has invalid value.');
    if (typeof wheelScrollAnimation !== 'boolean')
      console.error('react-js-pager: props.wheelScrollWithAnimation has invalid value.');
    if (!new Set(['scroll', 'opacity', 'scale', 'scaleX', 'scaleY', 'rotateX', 'rotateY', 'blur']).has(animationStyle))
      console.error('react-js-pager: props.animationStyle has invalid value.');
    if (typeof perspective !== 'number') console.error('react-js-pager: props.perspective has invalid value.');
    if (typeof duration !== 'number' || duration < 0) console.error('react-js-pager: props.duration has invalid value.');
    if (typeof loop !== 'boolean') console.error('react-js-pager: props.loop has invalid value.');
    if (typeof showScrollbar !== 'boolean') console.error('react-js-pager: props.showScrollbar has invalid value.');
    if (
      (!new Set([
        'linear',
        'easeInSine',
        'easeOutSine',
        'easeInOutSine',
        'easeInQuad',
        'easeOutQuad',
        'easeInOutQuad',
        'easeInCubic',
        'easeOutCubic',
        'easeInOutCubic',
        'easeInQuart',
        'easeOutQuart',
        'easeInOutQuart',
        'easeInQuint',
        'easeOutQuint',
        'easeInOutQuint',
        'easeInExpo',
        'easeOutExpo',
        'easeInOutExpo',
        'easeInCirc',
        'easeOutCirc',
        'easeInOutCirc',
        'easeInBack',
        'easeOutBack',
        'easeInOutBack',
        'easeInElastic',
        'easeOutElastic',
        'easeInOutElastic',
        'easeInBounce',
        'easeOutBounce',
        'easeInOutBounce',
      ]).has(easingFunction) &&
        typeof easingFunction === 'string') ||
      (typeof easingFunction !== 'string' && typeof easingFunction !== 'function')
    )
      console.error('react-js-pager: props.ease has invalid value.');
    if (onPageSelected && typeof onPageSelected !== 'function')
      console.error('react-js-pager: props.onPageSelected has invalid value.');
    if (onAnimation && typeof onAnimation !== 'function') console.error('react-js-pager: props.onAnimation has invalid value.');
    if (onNavigationStart && typeof onNavigationStart !== 'function')
      console.error('react-js-pager: props.onNavigationStart has invalid value.');
    if (props.onPagerScroll && typeof props.onPagerScroll !== 'function')
      console.error('react-js-pager: props.onPagerScroll has invalid value.');

    const allProps = new Set([
      'initialPage',
      'orientation',
      'touchGestures',
      'wheelScroll',
      'wheelScrollWithAnimation',
      'animationStyle',
      'perspective',
      'duration',
      'loop',
      'showScrollbar',
      'ease',
      'onNavigationStart',
      'onPageSelected',
      'onAnimation',
      'onPagerScroll',
      'wrapperStyle',
      'id',
      'className',
      'children',
    ]);
    for (const key in props) {
      if (Object.hasOwnProperty.call(props, key)) {
        if (!allProps.has(key)) console.error(`react-js-pager: can't recognize props.${key} it's not a valid prop.`);
      }
    }
  };
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') checkTypes();

  const [children, setChildren] = useStateCallback(props.children); // save childern in the state
  const [isFirstRender, setIsFirstRender] = useState(true); // used to call methods on first mount

  // input duration and distance settings that determine fast swipe.
  const time_min = 75;
  const time_max = 300;
  const input_distance = 50;
  const swipe_direction_distance = 10;

  //this method used to change pages except in the case of a touch swipe.
  const changePage = useCallback(
    /**
     * @param {Number} page The page index to navigate to.
     * @param {Boolean} withAnimation Wither to use animation or not while navigation.
     * @param {'previous' | 'next'} type Detrmine navigation direction used for 'rotate' animation style.
     */
    (page, withAnimation, type) => {
      if (!pagerRef.current) return;
      isResizing.current = false; // used to cancle 'rotate' animation style when browser window size is changing
      page = page ?? props.initialPage; // use initialPage index props if param is not given.
      withAnimation = withAnimation ?? true; // use animation if withAnimation param is not given.
      pos.current = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft']; // get scroll position depends on the orientation prop.
      scrollHeightTmp.current = pagerRef.current.scrollHeight; // save scroll width temporary to be use for onScrollEvent.
      scrollWidthTmp.current = pagerRef.current.scrollWidth; // save scroll height temporary to be use for onScrollEvent.

      const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl' && orientation !== 'vertical'; // check if pager wrapper element has right to left direction style only if the orientation prop is set to 'horizontal'.
      const lastPage = currentPageRef.current ?? 0; // save current page index as the previouse page before navigation to the new one.
      const pagerSize = parseFloat(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']); // pager wrapper element width or height depends on the orientation prop.
      const currentPos = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft']; // pager wrapper element current scroll position depends on the orientation prop.
      const children = pagerRef.current.children; // pager wrapper element childrens elements as pages.
      const pagesCount = children.length; // how many pages pager has.
      const maxScroll = pagesCount * pagerSize; // I'm not sure why i didn't use scrollWidth or scrollheight instead.
      const navigateTo = isRtl ? -(page * pagerSize) : page * pagerSize; // calculate page scroll position that will be navigated to.

      if (page === currentPageRef.current) return; // exit if the new page index equals the current page index.

      if (page > pagesCount - 1 || page < 0) {
        // exit if the new page index does not exist, could happens when using setPage method with wrong pageIndex param.
        console.error(`react-js-pager: cannot find page with index ${page}`);
        return;
      }

      // navigate to the new page index with animation styles.
      if (navigateTo < maxScroll) {
        onNavigationStart?.(page, lastPage); // call onNavigationStrat prop
        // scroll animation style
        if (withAnimation && animationStyle === 'scroll') {
          requestNum({ from: [currentPos, 0], to: [navigateTo, 1], duration, easingFunction }, (s, a) => {
            if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
            pagerRef?.current?.scrollTo(orientation === 'vertical' ? { top: s } : { left: s });
            onAnimation?.({ animationPercentage: a, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call onAnimation prop if exist on every frame.
            if (s === navigateTo) onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
          });
          // opacity animation style
        } else if (withAnimation && animationStyle === 'opacity') {
          // scroll to the next page index before starting the animation.
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo });
          // animate
          requestNum({ to: 1, duration, easingFunction }, o => {
            if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
            if (children?.[page]) children[page].style.opacity = o;
            onAnimation?.({ animationPercentage: o, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call onAnimation prop if exist on every frame.
            if (o === 1) onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
          });
          // scale animation style
        } else if (withAnimation && animationStyle === 'scale') {
          // scroll to the next page index before starting the animation.
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo });
          // animate
          requestNum({ to: 1, duration, easingFunction }, s => {
            if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
            if (children?.[page]) children[page].style.transform = `scale(${s})`;
            onAnimation?.({ animationPercentage: s, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call onAnimation prop if exist on every frame.
            if (s === 1) onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
          });
          // scaleX animation style
        } else if (withAnimation && animationStyle === 'scaleX') {
          // scroll to the next page index before starting the animation.
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo });
          // animate
          requestNum({ to: 1, duration, easingFunction }, s => {
            if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
            if (children?.[page]) children[page].style.transform = `scaleX(${s})`;
            onAnimation?.({ animationPercentage: s, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call onAnimation prop if exist on every frame.
            if (s === 1) onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
          });
          // scaleY animation style
        } else if (withAnimation && animationStyle === 'scaleY') {
          // scroll to the next page index before starting the animation.
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo });
          // animate
          requestNum({ to: 1, duration, easingFunction }, s => {
            if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
            if (children?.[page]) children[page].style.transform = `scaleY(${s})`;
            onAnimation?.({ animationPercentage: s, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call onAnimation prop if exist on every frame.
            if (s === 1) onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
          });
          // rotateY animation style
        } else if (withAnimation && animationStyle === 'rotateY') {
          // animate
          requestNum({ from: [0, 0], to: [180, 1], duration, easingFunction }, (r, o) => {
            if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
            // cancel animation if browser window size is changing to prevent incorrect arrangement of pages to happens.
            if (isResizing.current) {
              if (children?.[lastPage]) children[lastPage].style.removeProperty('transform'); // clean up
              if (children?.[page]) children[page].style.removeProperty('transform'); // clean up
              onAnimation?.({ animationPercentage: 1, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call last frame
              return;
            }
            // rotate current page from 0deg to 90deg.
            if (children?.[lastPage] && r <= 90)
              children[lastPage].style.transform = `perspective(${perspective}px) rotateY(${type === 'previous' ? -r : r}deg)`;
            // when the animation is half way scroll to the new page.
            if (r >= 90 && pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'] !== navigateTo) {
              pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo });
              if (children?.[lastPage]) children[lastPage].style.removeProperty('transform'); // clean up
            }
            // rotate the new page from 90deg to 180deg.
            if (children?.[page] && r >= 90)
              children[page].style.transform = `perspective(${perspective}px) rotateY(${
                type === 'previous' ? -r : r
              }deg) scaleX(-1)`;
            onAnimation?.({ animationPercentage: o, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call onAnimation prop if exist on every frame.
            // when the animation finishes.
            if (o === 1) {
              onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
              if (children?.[page]) children[page].style.removeProperty('transform'); // clean up
            }
          });
          // rotateX animation style
        } else if (withAnimation && animationStyle === 'rotateX') {
          // animate
          requestNum({ from: [0, 0], to: [180, 1], duration, easingFunction }, (r, o) => {
            if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
            // cancel animation if browser window size is changing to prevent incorrect arrangement of pages to happens.
            if (isResizing.current) {
              if (children?.[lastPage]) children[lastPage].style.removeProperty('transform'); // clean up
              if (children?.[page]) children[page].style.removeProperty('transform'); // clean up
              onAnimation?.({ animationPercentage: 1, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call last frame
              return;
            }
            // rotate current page from 0deg to 90deg.
            if (children?.[lastPage] && r <= 90)
              children[lastPage].style.transform = `perspective(${perspective}px) rotateX(${type === 'previous' ? -r : r}deg)`;
            // when the animation is half way scroll to the new page.
            if (r >= 90 && pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'] !== navigateTo) {
              pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo });
              if (children?.[lastPage]) children[lastPage].style.removeProperty('transform'); // clean up
            }
            // rotate the new page from 90deg to 180deg.
            if (children?.[page] && r >= 90)
              children[page].style.transform = `perspective(${perspective}px) rotateX(${
                type === 'previous' ? -r : r
              }deg) scaleY(-1)`;
            onAnimation?.({ animationPercentage: o, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call onAnimation prop if exist on every frame.
            // when the animation finishes.
            if (o === 1) {
              onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
              if (children?.[page]) children[page].style.removeProperty('transform'); // clean up
            }
          });
          // blur animation style
        } else if (withAnimation && animationStyle === 'blur') {
          // scroll to the next page index before starting the animation.
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo });
          // animate
          requestNum({ from: [20, 0], to: [0, 1], duration, easingFunction }, (b, o) => {
            if (!isMounted.current) return; // cancle animations if page is unmounted to prevent errors.
            if (children?.[page]) children[page].style.filter = `blur(${b}px)`;
            onAnimation?.({ animationPercentage: o, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false }); // call onAnimation prop if exist on every frame.
            // when the animation finishes.
            if (o === 1) {
              onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
              if (children?.[page]) children[page].style.removeProperty('filter'); // clean up
            }
          });
          // navigate to the new page index without any animation.
        } else {
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo }); // scroll to the next page index
          onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
        }
        // update isAnimationRunning variable.
        if (withAnimation)
          requestNum({ to: 1, duration, easingFunction }, s => {
            if (!isMounted.current) return;
            isAnimationRunning.current = true;
            if (s === 1) isAnimationRunning.current = false;
          });

        currentPageRef.current = page; // set the current page index to the new page index.
      }
    },
    [
      animationStyle,
      duration,
      easingFunction,
      onAnimation,
      onNavigationStart,
      onPageSelected,
      orientation,
      perspective,
      props.initialPage,
    ]
  );

  const wait = time => new Promise(e => setTimeout(e, time));

  // change every page width to fit the page wrapper element (orientation === 'horizontal')
  const adjustWidth = () => {
    if (!pagerRef.current) return;
    const children = pagerRef.current.children;
    const pagerWidth = parseFloat(window.getComputedStyle(pagerRef.current).width);
    for (let i = 0; i < children.length; i++) {
      const paddingLeft = parseFloat(window.getComputedStyle(children[i]).paddingLeft);
      const paddingRight = parseFloat(window.getComputedStyle(children[i]).paddingRight);
      const marginLeft = parseFloat(window.getComputedStyle(children[i]).marginLeft);
      const marginRight = parseFloat(window.getComputedStyle(children[i]).marginRight);
      const borderLeftWidth = parseFloat(window.getComputedStyle(children[i]).borderLeftWidth);
      const borderRightWidth = parseFloat(window.getComputedStyle(children[i]).borderRightWidth);
      children[i].style.minWidth =
        pagerWidth - (paddingLeft + paddingRight + marginLeft + marginRight + borderLeftWidth + borderRightWidth) + 'px';
    }
  };

  // change every page height to fit the page wrapper element (orientation === 'vertical').
  const adjustHeight = () => {
    if (!pagerRef.current) return;
    const children = pagerRef.current.children;
    const pagerHeight = parseFloat(window.getComputedStyle(pagerRef.current).height);
    for (let i = 0; i < children.length; i++) {
      const paddingTop = parseFloat(window.getComputedStyle(children[i]).paddingTop);
      const paddingBottom = parseFloat(window.getComputedStyle(children[i]).paddingBottom);
      const marginTop = parseFloat(window.getComputedStyle(children[i]).marginTop);
      const marginBottom = parseFloat(window.getComputedStyle(children[i]).marginBottom);
      const borderTopWidth = parseFloat(window.getComputedStyle(children[i]).borderTopWidth);
      const borderBottomWidth = parseFloat(window.getComputedStyle(children[i]).borderBottomWidth);
      children[i].style.minHeight =
        pagerHeight - (paddingTop + paddingBottom + marginTop + marginBottom + borderTopWidth + borderBottomWidth) + 'px';
    }
  };

  // wait a little bit of time to change pages size on the first render, some css styles take time to apply like 'aspect-ratio'
  const adjustSize = async () => {
    await wait(75);
    orientation === 'vertical' ? adjustHeight() : adjustWidth();
  };

  // change pages size and adjust current scroll position when browser window size is changing.
  const onResizeHandle = () => {
    if (!pagerRef.current || isAnimationRunning.current) return;
    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl' && orientation !== 'vertical'; // check if pager wrapper element has right to left direction style only if the orientation prop is set to 'horizontal'.
    const page = currentPageRef.current;
    isResizing.current = true;
    orientation === 'vertical' ? adjustHeight() : adjustWidth();
    const pagerSize = parseFloat(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
    const navigateTo = isRtl ? -(page * pagerSize) : page * pagerSize;
    pagerRef.current.scrollTo(orientation === 'vertical' ? { top: navigateTo } : { left: navigateTo });
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
    const duration = 300;

    // swipe to the right, (left in case of direction is right to left (rtl) and the orientation prop is 'horizontal')
    if (
      (Math.abs(moving_distance) > size / 2 && moving_direction === 'negative') ||
      (moving_time > time_min &&
        moving_time < time_max &&
        Math.abs(moving_distance) > input_distance &&
        moving_direction === 'negative')
    ) {
      const page = isRtl ? currentPageRef.current - 1 : currentPageRef.current + 1; // new page index depends on RTL.
      const navigateTo = isRtl ? -(page * size) : page * size; // new page position depends on RTL.
      if ((!isRtl && page > pagerRef.current.children.length - 1) || (isRtl && page < 0)) return; // exit if there is nothing to swipe to.
      onNavigationStart?.(page, lastPage); // call onNavigationStrat prop
      // animate
      requestNum(
        { from: [pos.current - moving_distance, 0], to: [navigateTo, 1], duration, easingFunction: 'easeOutExpo' },
        (s, a) => {
          pagerRef?.current?.scrollTo(orientation === 'vertical' ? { top: s } : { left: s });
          onAnimation?.({ animationPercentage: a, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: true }); // call onAnimation prop if exist on every frame.
          if (s === pos.current + size) onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
        }
      );
      currentPageRef.current = page; // set the current page index to the new page index.

      // swipe to the left, (right in case of direction is right to left (rtl) and the orientation prop is 'horizontal')
    } else if (
      (Math.abs(moving_distance) > size / 2 && moving_direction === 'positive') ||
      (moving_time > time_min &&
        moving_time < time_max &&
        Math.abs(moving_distance) > input_distance &&
        moving_direction === 'positive')
    ) {
      const page = isRtl ? currentPageRef.current + 1 : currentPageRef.current - 1; // new page index depends on RTL.
      const navigateTo = isRtl ? -(page * size) : page * size; // new page position depends on RTL.
      if ((!isRtl && page < 0) || (isRtl && page > pagerRef.current.children.length - 1)) return; // exit if there is nothing to swipe to.
      onNavigationStart?.(page, lastPage); // call onNavigationStrat prop
      // animate
      requestNum(
        { from: [pos.current - moving_distance, 0], to: [navigateTo, 1], duration, easingFunction: 'easeOutExpo' },
        (s, a) => {
          pagerRef?.current?.scrollTo(orientation === 'vertical' ? { top: s } : { left: s });
          onAnimation?.({ animationPercentage: a, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: true }); // call onAnimation prop if exist on every frame.
          if (s === pos.current - size) onPageSelected?.(page, lastPage); // call onPageSelected prop if exist after finishing navigation to the new page index.
        }
      );
      currentPageRef.current = page; // set the current page index to the new page index.
      // not enough swipe, return to the current page.
    } else {
      // animate
      requestNum(
        {
          from: [pos.current - moving_distance, 0],
          to: [pos.current, 1],
          duration,
          easingFunction: x => 1 + (0.8 + 1) * Math.pow(x - 1, 3) + 0.8 * Math.pow(x - 1, 2),
        },
        (s, a) => {
          pagerRef?.current?.scrollTo(orientation === 'vertical' ? { top: s } : { left: s });
          onAnimation?.({
            animationPercentage: a,
            selectedPageIndex: currentPageRef.current,
            previousPageIndex: currentPageRef.current,
            touchSwipe: true,
          }); // call onAnimation prop if exist on every frame.
        }
      );
    }
    pagerRef.current.removeEventListener('touchmove', onTouchMove);
  };

  const onTouchMove = e => {
    if (e.cancelable) e.preventDefault();

    const touchX = e.targetTouches[0].pageX;
    const touchY = e.targetTouches[0].pageY;

    const horizontal_distance = Math.abs(touchX - x.current);
    const verical_destance = Math.abs(touchY - y.current);

    // check if the touch swipe is for scrolling or for navigating to new page.
    isSwipe.current =
      isSwipe.current === true
        ? true
        : orientation === 'vertical'
        ? verical_destance > swipe_direction_distance
        : horizontal_distance > swipe_direction_distance;

    // cancel page touch navigation in favour of touch scrolling (inside page wrapper element only).
    if (
      (orientation === 'vertical'
        ? horizontal_distance > swipe_direction_distance
        : verical_destance > swipe_direction_distance) &&
      !isSwipe.current
    ) {
      isCanceled.current = true;
      pagerRef.current.scrollTo(orientation === 'vertical' ? { top: pos.current } : { left: pos.current }); // reset current page poistion.
      pagerRef.current.removeEventListener('touchmove', onTouchMove);
      return;
    }

    let moveTo = pos.current - (orientation === 'vertical' ? touchY - y.current : touchX - x.current); // calculate touch move tracking value.

    pagerRef.current.scrollTo(orientation === 'vertical' ? { top: moveTo } : { left: moveTo });
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
    pagerRef.current.addEventListener('touchmove', onTouchMove, { passive: false });
  };

  // readjust if pages elements are changed.
  const onChildrenChange = useCallback(() => {
    setChildren(props.children, () => adjustSize());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.children]);

  // wait a little bit of time to set initial page the first render, waiting for adjustSize to be done.
  const setInitialPage = async () => {
    await wait(100);
    changePage(initialPage, false);
  };

  useLayoutEffect(() => {
    if (isFirstRender) {
      orientation === 'vertical' ? adjustHeight() : adjustWidth();
      resizeObserver.current = new ResizeObserver(onResizeHandle).observe(pagerRef.current);
      changePage(initialPage, false);
      setInitialPage(); // navigate to initialPage index prop.
      setIsFirstRender(false);
    }

    onChildrenChange(); // add pages and adjust their sizes.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePage, onChildrenChange]);

  useEffect(() => {
    const pagerEl = pagerRef.current;
    const pagerObserver = resizeObserver.current;
    return () => {
      isMounted.current = false;
      pagerObserver?.unobserve(pagerEl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      changePage(
        Math.min(Math.max(currentPageRef.current - 1, 0), pagerRef.current.children.length - 1),
        withAnimation,
        'previous'
      );
    }
  };

  useImperativeHandle(ref, () => ({ next, previous, setPage }));

  const wheelHandle = e => (e.deltaY > 0 ? next(wheelScrollAnimation) : previous(wheelScrollAnimation));

  const onScrollHandle = event => {
    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl' && orientation !== 'vertical';

    const pagerHeight = parseFloat(window.getComputedStyle(pagerRef.current).height);
    const pagerWidth = parseFloat(window.getComputedStyle(pagerRef.current).width);

    const scrollX = pagerRef.current.scrollLeft;
    const scrollY = pagerRef.current.scrollTop;
    const scrollHeight = pagerRef.current.scrollHeight;
    const scrollWidth = pagerRef.current.scrollWidth;

    const percentageX = isRtl
      ? -(scrollX / (scrollWidthTmp.current - pagerWidth)) || 0
      : scrollX / (scrollWidthTmp.current - pagerWidth) || 0;
    const percentageY = isRtl
      ? -(scrollY / (scrollHeightTmp.current - pagerHeight)) || 0
      : scrollY / (scrollHeightTmp.current - pagerHeight) || 0;

    if (!isResizing.current)
      props.onPagerScroll?.({
        percentageX,
        percentageY,
        scrollX,
        scrollY,
        scrollHeight,
        scrollWidth,
        pagerWidth,
        pagerHeight,
        event,
      });
  };

  return (
    <div
      ref={pagerRef}
      style={wrapperStyle}
      onTouchStart={touchGestures ? onTouchStart : null}
      onTouchEnd={touchGestures ? onTouchEnd : null}
      onWheel={wheelScroll ? wheelHandle : null}
      onScroll={props.onPagerScroll ? onScrollHandle : null}
      id={props.id}
      className={props.className}
    >
      {children}
    </div>
  );
});

// custom react hook, I get it from Stack Overflow website.
function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // init mutable ref container for callbacks

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(state);
  }, []); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

export default Pager;
