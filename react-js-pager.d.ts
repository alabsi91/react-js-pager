type requestFrameEasing =
  | 'linear'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce';

interface onPagerScrollProps {
  /**
   * - Pager scrolled length percentage on the X axis, a value between (0 - 1).
   */
  percentageX?: number;

  /**
   * - Pager scrolled length percentage on the Y axis, a value between (0 - 1).
   */
  percentageY?: number;

  /**
   * - Pager current scrolling position on the X axis.
   */
  scrollX?: number;

  /**
   * - Pager current scrolling position on the Y axis.
   */
  scrollY?: number;

  /**
   * - Pager scroll width in px.
   */
  scrollWidth?: number;

  /**
   * - Pager scroll height in px.
   */
  scrollHeight?: number;

  /**
   * - Pager computed width in px.
   */
  pagerWidth?: number;

  /**
   * - Pager computed height in px.
   */
  pagerHeight?: number;

  /**
   * - Pager onscroll native event.
   */
  event?: object;
}

interface onAnimationProps {
  /**
   * - Animation progress percentage, a value between (0 - 1).
   */
  animationPercentage: number;
  /**
   * - The page index that will be navigated to.
   */
  selectedPageIndex: number;
  /**
   * - The page index that will be navigated from.
   */
  previousPageIndex: number;
  /**
   * - Wither the animation is coming from a touch swipe or not.
   */
  touchSwipe: boolean;
}

interface PagerProps {
  /**
   * - Set `horizontal` or `vertical` scrolling orientation.
   * - If set to `vertical` make sure to provide a height in `wrapperStyle` otherwise height will be set to `50vh`.
   * - **Default Value** `horizontal`
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * - Index of initial page that should be selected on the first render.
   * - **Default Value** `0`
   */
  initialPage?: number;

  /**
   * - Loop scrolling between pages.
   * - **Note:** Loop doesn't work for touch swipe scrolling.
   * - **Default Value** `false`
   */
  loop?: boolean;

  /**
   * - Enable/Disable swipe gesture for touch screens.
   * - **Default Value** `true`
   */
  touchGestures?: boolean;

  /**
   * - Pager wrapper element style.
   * - **Note:** Pager wrapper element has a flex box style by default.
   */
  wrapperStyle?: React.CSSProperties;

  /**
   * - Change pages by rotating mouse scroll wheel.
   * - **Default Value** `true`
   */
  wheelScroll?: boolean;

  /**
   * - Wither to use animation when changing pages with mouse scroll wheel.
   * - **Default Value** `true`
   */
  wheelScrollWithAnimation?: boolean;

  /**
   * - Wither to show or hide pager scrollbar.
   * - **Default Value** `false`
   */
  showScrollbar?: boolean;

  /**
   * - Changing page animation style.
   * - **Note:** touch gestures always uses `scroll` animation style.
   * - **Default Value** `scroll`
   */
  animationStyle?: 'blur' | 'opacity' | 'scroll' | 'scale' | 'scaleX' | 'scaleY' | 'rotateX' | 'rotateY';

  /**
   * - 3d transform perspective value used only for `rotateX` and `rotateY` animation style.
   * - **Default Value** `1000`
   */
  perspective?: number;

  /**
   * - Changing page animation duration.
   * - **Default Value** 300
   */
  duration?: number;

  /**
   * - Changing page animation transition timing function.
   * - Check [easings.net](https://easings.net/) to learn more.
   * - **Default Value** `easeOutExpo`
   */
  ease?: requestFrameEasing | ((x: number) => number);

  /**
   * - This callback will be called every time animation frame changes, including touch swipes.
   */
  onAnimation?: (event?: onAnimationProps) => void;

  /**
   * - This callback will be called once the Pager starts navigating to the selected page.
   */
  onNavigationStart?: (selectedPageIndex?: number, previousPageIndex?: number) => void;

  /**
   * - This callback will be called once the Pager finishes navigating to the selected page.
   */
  onPageSelected?: (selectedPageIndex?: number, previousPageIndex?: number) => void;

  /**
   * - Executed when transitioning between pages (ether because the animation for the requested page has changed or when the user is swiping/dragging between pages).
   */
  onPagerScroll?: (e?: onPagerScrollProps) => void;

  /**
   * - Pager Methods
   */
  ref?: React.LegacyRef<PagerMethods>;

  className?: string | undefined;

  id?: string | undefined;
}

interface PagerMethods {
  /**
   * - Navigate to the next page.
   * - Takes a boolean param to enable/disable animation.
   */
  next?: (withAnimation?: boolean) => void;

  /**
   * - Navigate to the previous page.
   * - Takes a boolean param to enable/disable animation.
   */
  previous?: (withAnimation?: boolean) => void;

  /**
   * - Navigate to a specific page.
   * - Takes a number param (pageIndex) and a boolean param to enable/disable animation.
   */
  setPage?: (pageIndex?: number, withAnimation?: boolean) => void;
}

declare const Pager: React.FunctionComponent<PagerProps>;

export default Pager;
