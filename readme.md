# react-js-pager

<br />

![npm](https://img.shields.io/npm/v/react-js-pager) ![npm bundle size](https://img.shields.io/bundlephobia/min/react-js-pager)
![NPM](https://img.shields.io/npm/l/react-js-pager)

- React library to alows users to navigate through pages of data.
- Best for creating tabs, image slider, fullPage scrolling and more.

![](https://github.com/alabsi91/react-js-pager/blob/acc8280db39c4bf3c856d49168608cb17e0d1d22/tab.gif)
![](https://github.com/alabsi91/react-js-pager/blob/fbe10303506cf981224d4c59c3254bf078e91710/next.gif)

![](https://github.com/alabsi91/react-js-pager/blob/7ee278d5ed09eed494c402146d8c125cd9f75f9f/fullpage.gif)

![](https://github.com/alabsi91/react-js-pager/blob/c3319c05e7c7618d16808c94ec8ab4395c622099/slider2.gif)

## Installation

`npm install react-js-pager`

## Usage

```jsx
//...
import Pager from 'react-js-pager';

export default function App() {
  let pagerMethods = null;

  const next_page_handle = () => {
    if (pagerMethods !== null) pagerMethods.next();
  };

  const previous_page_handle = () => {
    if (pagerMethods !== null) pagerMethods.previous();
  };

  const set_page_handle = pageIndex => {
    if (pagerMethods !== null) pagerMethods.setPage(pageIndex);
  };

  return (
    <>
      <div id='pager'>
        <Pager
          ref={node => (pagerMethods = node)}
          orientation='horizontal'
          animationStyle='scroll'
          wrapperStyle={{ width: '300px' }}
        >
          {/* Page with index (0) */}
          <div className='pageContainer'>...Page0 Content</div>

          {/* Page with index (1) */}
          <div className='pageContainer'>...Page1 Content</div>

          {/* Page with index (2) */}
          <div className='pageContainer'>...Page2 Content</div>
        </Pager>
      </div>
    </>
  );
}
```

## Props

### orientation : _[ 'horizontal' | 'vertical' ] [optional]_

- Set `horizontal` or `vertical` scrolling orientation.
- If set to `vertical` make sure to provide a `height` value in `wrapperStyle` otherwise it will be set to `50vh`.
- **Default Value** `horizontal`

### initialPage : _[Number] [optional]_

- Index of initial page that should be selected on the first render.
- **Default Value** `0`

### loop : _[Boolean] [optional]_

- Loop scrolling between pages.
- **Note:** Loop scrolling doesn't work for touch swipe/drag gestures.
- **Default Value** `false`

### touchGestures : _[Boolean] [optional]_

- Enable/Disable swipe/drag gestures for touch screens.
- **Default Value** `true`

### wrapperStyle : _[Object] [optional]_

- Pager wrapper element style.
- **Note:** Pager wrapper element has a flex box style by default.

### wheelScroll : _[Boolean] [optional]_

- Change pages by rotating mouse scroll wheel.
- **Default Value** `true`

### wheelScrollWithAnimation : _[Boolean] [optional]_

- Wither to use animations when changing pages with mouse scroll wheel or not.
- **Default Value** `true`

### showScrollbar : _[Boolean] [optional]_

- Wither to show or hide pager scrollbar.
- **Default Value** `false`

### animationStyle : _[ 'blur' | 'opacity' | 'scroll' | 'scale' | 'scaleX' | 'scaleY' | 'rotateX' | 'rotateY' ] [optional]_

- Animation style when navigating through pages.
- **Note:** touch swipe/drag gestures always uses `scroll` animation style.
- **Default Value** `scroll`

### perspective : _[Number] [optional]_

- 3d transform perspective value used only for `rotateX` and `rotateY` animation style.
- **Default Value** `1000`

### duration : _[Number] [optional]_

- Navigate through pages animation duration in ms.
- **Default Value** `300`

### ease : _[ String | Function ] [optional]_

- Navigate through pages animation transition timing function.
- **Default Value** `easeOutExpo`
- Easing functions specify the rate of change of the number over time.
- Avaliable Easing functions :
  `"linear", "easeInSine", "easeOutSine", "easeInOutSine", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeInBack", "easeOutBack", "easeInOutBack", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeInBounce", "easeOutBounce", "easeInOutBounce"`
- If you want to provide your own timing-function make sure that the function takes one parameter and returns one value.

```javascript
function easeInQuad(x) {
  return x * x;
}
```

### adjustPagesSizes : _[Boolean] [optional]_

- If you have pages with different widths/heights depends on the `orientation` this may cause unwanted extra space for the smaller
  pages.
- Adjust unshowed pages width/height depends on the `orientation` to match page wrapper element width/height.
- **Warning:** Don't use this if you have pages with specific widths/heights style, this method will overwirte theme.
- Check [Limitation](#limitation) section.
- **Default Value** `false`

### onAnimation : _[ ( event: Object ) => void ] [optional]_

- This callback will be called every time animation frame changes, including touch swipe/drag gestures.

|      Event props      | Description                                               |  Type   |
| :-------------------: | --------------------------------------------------------- | :-----: |
| `animationPercentage` | Animation progress percentage, a value between (0 - 1).   | Number  |
|  `selectedPageIndex`  | The page index that will be navigated to.                 | Number  |
|  `previousPageIndex`  | The page index that will be navigated from.               | Number  |
|     `touchSwipe`      | Wither the animation is coming from a touch swipe or not. | Boolean |

### onNavigationStart : _[ ( selectedPageIndex: Number, previousPageIndex: Number ) => void ] [optional]_

- This callback will be called once the pager starts navigating to the selected page.

|       Params        | Description                         |  Type  |
| :-----------------: | ----------------------------------- | :----: |
| `selectedPageIndex` | The page index that navigated to.   | Number |
| `previousPageIndex` | The page index that navigated from. | Number |

### onPageSelected : _[ ( selectedPageIndex: Number, previousPageIndex: Number ) => void ] [optional]_

- This callback will be called once the pager finishes navigating to the selected page.

|       Params        | Description                         |  Type  |
| :-----------------: | ----------------------------------- | :----: |
| `selectedPageIndex` | The page index that navigated to.   | Number |
| `previousPageIndex` | The page index that navigated from. | Number |

### onPagerScroll : _[ ( event: Object ) => void ] [optional]_

- Executed when transitioning between pages (ether because the animation for the requested page has changed or when the user is
  swiping/dragging between pages).
- This is usefull for animating pages/tabs/slides indicators among other things.

|  Event props   | Description                                                              |  Type  |
| :------------: | ------------------------------------------------------------------------ | :----: |
| `percentageX`  | Pager scrolled length percentage on the X axis, a value between (0 - 1). | Number |
| `percentageY`  | Pager scrolled length percentage on the Y axis, a value between (0 - 1). | Number |
|   `scrollX`    | Pager current scrolling position on the X axis.                          | Number |
|   `scrollY`    | Pager current scrolling position on the Y axis.                          | Number |
| `scrollWidth`  | Pager scroll width in px.                                                | Number |
| `scrollHeight` | Pager scroll height in px.                                               | Number |
|  `pagerWidth`  | Pager computed width in px.                                              | Number |
| `pagerHeight`  | Pager computed height in px.                                             | Number |
|    `event`     | Pager onscroll native event.                                             | Object |

## Methods

### next : ( withAnimation?: Boolean ) => void

- Navigate to the next page.
- Takes a boolean param to enable/disable animation.

### previous : ( withAnimation?: Boolean ) => void

- Navigate to the previous page.
- Takes a boolean param to enable/disable animation.

### setPage : ( pageIndex: Number, withAnimation?: Boolean ) => void

- Navigate to a specific page index.
- Takes a number param (pageIndex) and a boolean param to enable/disable animation.

## Limitation

- `height` in case of `horizontal` orientation, `width` in case of `vertical` orientation.
  - The limitation only apply if you have different pages heights/widths.
  - The (`height` / `width`) of Pager wrapper element does not match the viewed page, it will match the highest/widest page you
    have.
  - Even if you specify the pager (`height` / `width`) style to be shorter than the highest/widest page, a scrollbar will show up.
  - If necessary, you can workaround this by setting [adjustPagesSizes](#adjustpagessizes--boolean-optional) prop to `true`.

![](https://github.com/alabsi91/react-js-pager/blob/43b5a1d17b14a8c9d02e7749f08d9d51724f7bdd/limitation.png)
