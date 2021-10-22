import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { requestNum } from 'request-animation-number';

const Pager = forwardRef((props, ref) => {
  const pagerRef = useRef();
  const currentPageRef = useRef();
  const x = useRef();
  const y = useRef();
  const t = useRef();
  const pos = useRef();
  const isSwipe = useRef();
  const isCanceled = useRef();
  const scrollWidthTmp = useRef();
  const scrollHeightTmp = useRef();

  const initialPage = props.initialPage ?? 0;
  const orientation = props.orientation ?? 'horizontal'; // 'vertical'
  const touchGestures = props.touchGestures ?? true;
  const wheelScroll = props.wheelScroll ?? true;
  const wheelScrollAnimation = props.wheelScrollWithAnimation ?? true;
  const animationStyle = props.animationStyle ?? 'scroll'; // 'opacity', 'scale', 'scaleX', 'scaleY'
  const duration = props.duration ?? 300;
  const loop = props.loop ?? false;
  const showScrollbar = props.showScrollbar ?? false;
  const easingFunction = props.ease ?? 'easeOutExpo';
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

  const [children, setChildren] = useStateCallback(props.children);
  const [, setCurrentPage] = useState(initialPage);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // input duration and distance settings that determine fast swipe.
  const time_min = 75;
  const time_max = 300;
  const input_distance = 50;
  const swipe_direction_distance = 10;

  const changePage = useCallback(
    (page, withAnimation, type) => {
      page = page ?? props.initialPage;
      withAnimation = withAnimation ?? true;
      pos.current = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'];
      scrollHeightTmp.current = pagerRef.current.scrollHeight;
      scrollWidthTmp.current = pagerRef.current.scrollWidth;

      const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl' && orientation !== 'vertical';
      const lastPage = currentPageRef.current ?? 0;
      const pagerSize = parseInt(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
      const currentPos = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'];
      const children = pagerRef.current.children;
      const pagesCount = children.length;
      const maxScroll = pagesCount * pagerSize;
      const nextPos = isRtl ? -(page * pagerSize) : page * pagerSize;

      if (page === currentPageRef.current) return;

      if (page > pagesCount - 1 || page < 0) {
        console.error(`react-js-pager: cannot find page with index ${page}`);
        return;
      }

      if (nextPos < maxScroll) {
        if (withAnimation && animationStyle === 'scroll') {
          requestNum({ from: [currentPos, 0], to: [nextPos, 1], duration, easingFunction }, (s, a) => {
            pagerRef?.current?.scrollTo(orientation === 'vertical' ? { top: s } : { left: s });
            onAnimation?.({ animationPercentage: a, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false });
            if (s === nextPos) onPageSelected?.(page, lastPage);
          });
        } else if (withAnimation && animationStyle === 'opacity') {
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: nextPos } : { left: nextPos });
          requestNum({ to: 1, duration, easingFunction }, o => {
            if (children?.[page]) children[page].style.opacity = o;
            onAnimation?.({ animationPercentage: o, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false });
            if (o === 1) onPageSelected?.(page, lastPage);
          });
        } else if (withAnimation && animationStyle === 'scale') {
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: nextPos } : { left: nextPos });
          requestNum({ to: 1, duration, easingFunction }, s => {
            if (children?.[page]) children[page].style.transform = `scale(${s})`;
            onAnimation?.({ animationPercentage: s, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false });
            if (s === 1) onPageSelected?.(page, lastPage);
          });
        } else if (withAnimation && animationStyle === 'scaleX') {
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: nextPos } : { left: nextPos });
          requestNum({ to: 1, duration, easingFunction }, s => {
            if (children?.[page]) children[page].style.transform = `scaleX(${s})`;
            onAnimation?.({ animationPercentage: s, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false });
            if (s === 1) onPageSelected?.(page, lastPage);
          });
        } else if (withAnimation && animationStyle === 'scaleY') {
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: nextPos } : { left: nextPos });
          requestNum({ to: 1, duration, easingFunction }, s => {
            if (children?.[page]) children[page].style.transform = `scaleY(${s})`;
            onAnimation?.({ animationPercentage: s, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false });
            if (s === 1) onPageSelected?.(page, lastPage);
          });
        } else if (withAnimation && animationStyle === 'rotateY') {
          requestNum({ from: [0, 0], to: [180, 1], duration, easingFunction }, (r, o) => {
            if (children?.[lastPage] && r <= 90)
              children[lastPage].style.transform = `perspective(500px) rotateY(${type === 'previous' ? -r : r}deg)`;
            if (r >= 90 && pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'] !== nextPos) {
              pagerRef.current.scrollTo(orientation === 'vertical' ? { top: nextPos } : { left: nextPos });
              if (children?.[lastPage]) children[lastPage].style.removeProperty('transform');
            }
            if (children?.[page] && r >= 90)
              children[page].style.transform = `perspective(500px) rotateY(${type === 'previous' ? -r : r}deg) scaleX(-1)`;
            onAnimation?.({ animationPercentage: o, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false });
            if (o === 1) {
              onPageSelected?.(page, lastPage);
              if (children?.[page]) children[page].style.removeProperty('transform');
            }
          });
        } else if (withAnimation && animationStyle === 'rotateX') {
          requestNum({ from: [0, 0], to: [180, 1], duration, easingFunction }, (r, o) => {
            if (children?.[lastPage] && r <= 90)
              children[lastPage].style.transform = `perspective(500px) rotateX(${type === 'previous' ? -r : r}deg)`;
            if (r >= 90 && pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'] !== nextPos) {
              pagerRef.current.scrollTo(orientation === 'vertical' ? { top: nextPos } : { left: nextPos });
              if (children?.[lastPage]) children[lastPage].style.removeProperty('transform');
            }
            if (children?.[page] && r >= 90)
              children[page].style.transform = `perspective(500px) rotateX(${type === 'previous' ? -r : r}deg) scaleY(-1)`;
            onAnimation?.({ animationPercentage: o, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: false });
            if (o === 1) {
              onPageSelected?.(page, lastPage);
              if (children?.[page]) children[page].style.removeProperty('transform');
            }
          });
        } else {
          pagerRef.current.scrollTo(orientation === 'vertical' ? { top: nextPos } : { left: nextPos });
          onPageSelected?.(page, lastPage);
        }

        setCurrentPage(page);
        currentPageRef.current = page;
      }
    },
    [animationStyle, duration, easingFunction, onAnimation, onPageSelected, orientation, props.initialPage]
  );

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
      children[i].style.minWidth =
        pagerWidth - (paddingLeft + paddingRight + marginLeft + marginRight + borderLeftWidth + borderRightWidth) + 'px';
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
      children[i].style.minHeight =
        pagerHeight - (paddingTop + paddingBottom + marginTop + marginBottom + borderTopWidth + borderBottomWidth) + 'px';
    }
  };

  const onResizeHandle = () => {
    const page = currentPageRef.current;
    orientation === 'vertical' ? adjustHeight() : adjustWidth();
    const pagerSize = parseInt(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
    const nextPos = page * pagerSize;
    pagerRef.current.scrollTo(orientation === 'vertical' ? { top: nextPos } : { left: nextPos });
  };

  const onTouchEnd = e => {
    isSwipe.current = null;
    if (isCanceled.current) return;

    const touchX = e.changedTouches[0].pageX;
    const touchY = e.changedTouches[0].pageY;

    const isRtl = window.getComputedStyle(pagerRef.current).direction === 'rtl' && orientation !== 'vertical';
    const lastPage = currentPageRef.current;
    const size = parseInt(window.getComputedStyle(pagerRef.current)[orientation === 'vertical' ? 'height' : 'width']);
    const moving_distance = orientation === 'vertical' ? touchY - y.current : touchX - x.current;
    const moving_direction = moving_distance < 0 ? 'negative' : 'positive';
    const moving_time = Date.now() - t.current;
    const duration = 300;

    if (
      (Math.abs(moving_distance) > size / 2 && moving_direction === 'negative') ||
      (moving_time > time_min &&
        moving_time < time_max &&
        Math.abs(moving_distance) > input_distance &&
        moving_direction === 'negative')
    ) {
      const page = isRtl ? currentPageRef.current - 1 : currentPageRef.current + 1;
      if ((!isRtl && page > pagerRef.current.children.length - 1) || (isRtl && page < 0)) return;
      requestNum(
        { from: [pos.current - moving_distance, 0], to: [pos.current + size, 1], duration, easingFunction: 'easeOutExpo' },
        (s, a) => {
          pagerRef?.current?.scrollTo(orientation === 'vertical' ? { top: s } : { left: s });
          onAnimation?.({ animationPercentage: a, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: true });
          if (s === pos.current + size) onPageSelected?.(page, lastPage);
        }
      );
      setCurrentPage(page);
      currentPageRef.current = page;
    } else if (
      (Math.abs(moving_distance) > size / 2 && moving_direction === 'positive') ||
      (moving_time > time_min &&
        moving_time < time_max &&
        Math.abs(moving_distance) > input_distance &&
        moving_direction === 'positive')
    ) {
      const page = isRtl ? currentPageRef.current + 1 : currentPageRef.current - 1;
      if ((!isRtl && page < 0) || (isRtl && page > pagerRef.current.children.length - 1)) return;
      requestNum(
        { from: [pos.current - moving_distance, 0], to: [pos.current - size, 1], duration, easingFunction: 'easeOutExpo' },
        (s, a) => {
          pagerRef?.current?.scrollTo(orientation === 'vertical' ? { top: s } : { left: s });
          onAnimation?.({ animationPercentage: a, selectedPageIndex: page, previousPageIndex: lastPage, touchSwipe: true });
          if (s === pos.current - size) onPageSelected?.(page, lastPage);
        }
      );
      setCurrentPage(page);
      currentPageRef.current = page;
    } else {
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
          });
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

    isSwipe.current =
      isSwipe.current === true
        ? true
        : orientation === 'vertical'
        ? verical_destance > swipe_direction_distance
        : horizontal_distance > swipe_direction_distance;

    if (
      (orientation === 'vertical'
        ? horizontal_distance > swipe_direction_distance
        : verical_destance > swipe_direction_distance) &&
      !isSwipe.current
    ) {
      isCanceled.current = true;
      pagerRef.current.scrollTo(orientation === 'vertical' ? { top: pos.current } : { left: pos.current });
      pagerRef.current.removeEventListener('touchmove', onTouchMove);
      return;
    }

    let moveTo = pos.current - (orientation === 'vertical' ? touchY - y.current : touchX - x.current);

    pagerRef.current.scrollTo(orientation === 'vertical' ? { top: moveTo } : { left: moveTo });
  };

  const onTouchStart = e => {
    const touchX = e.targetTouches[0].pageX;
    const touchY = e.targetTouches[0].pageY;
    isCanceled.current = false;
    x.current = touchX;
    y.current = touchY;
    pos.current = pagerRef.current[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'];
    t.current = Date.now();
    pagerRef.current.addEventListener('touchmove', onTouchMove, { passive: false });
  };

  const onChildrenChange = useCallback(() => {
    orientation === 'vertical'
      ? setChildren(props.children, () => adjustHeight())
      : setChildren(props.children, () => adjustWidth());
  }, [orientation, props.children, setChildren]);

  useLayoutEffect(() => {
    if (isFirstRender) {
      orientation === 'vertical' ? adjustHeight() : adjustWidth();
      changePage(initialPage, false);
      window.addEventListener('resize', onResizeHandle);
      setIsFirstRender(false);
    }

    onChildrenChange();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePage, onChildrenChange]);

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', onResizeHandle);
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

    const pagerHeight = parseInt(window.getComputedStyle(pagerRef.current).height);
    const pagerWidth = parseInt(window.getComputedStyle(pagerRef.current).width);

    const scrollX = pagerRef.current.scrollLeft;
    const scrollY = pagerRef.current.scrollTop;
    const scrollHeight = pagerRef.current.scrollHeight;
    const scrollWidth = pagerRef.current.scrollWidth;

    const percentageX = isRtl
      ? -(scrollX / (scrollWidthTmp.current - pagerWidth))
      : scrollX / (scrollWidthTmp.current - pagerWidth);
    const percentageY = isRtl
      ? -(scrollY / (scrollHeightTmp.current - pagerHeight))
      : scrollY / (scrollHeightTmp.current - pagerHeight);

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
    >
      {children}
    </div>
  );
});

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
