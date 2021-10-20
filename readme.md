# react-js-pager

<br />

![npm](https://img.shields.io/npm/v/react-js-pager) ![npm bundle size](https://img.shields.io/bundlephobia/min/react-js-pager)
![NPM](https://img.shields.io/npm/l/react-js-pager)

- React library to alows the user to swipe through pages of data.
- Best for creating tabs, image slider, fullPage scrolling and more.

![](https://github.com/alabsi91/react-js-pager/blob/acc8280db39c4bf3c856d49168608cb17e0d1d22/tab.gif) ![](https://github.com/alabsi91/react-js-pager/blob/fbe10303506cf981224d4c59c3254bf078e91710/next.gif)

![](https://github.com/alabsi91/react-js-pager/blob/7ee278d5ed09eed494c402146d8c125cd9f75f9f/fullpage.gif)

![](https://github.com/alabsi91/react-js-pager/blob/5194d39618ead7d6cad790f0e8ba9621afa3f810/slider.gif)

## Installation

`npm install react-js-pager`

## Usage

```javascript
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

  const choose_page_handle = pageIndex => {
    if (pagerMethods !== null) pagerMethods.setPage(pageIndex);
  };

  return (
    <>
      <div id='pagerContainer'>
        <Pager ref={node => (pagerMethods = node)} orientation='horizontal' wrapperStyle={{ width: '300px' }}>
          // page with index (0)
          <div>//...page content</div>
          // page with index (1)
          <div>//...page content</div>
          // page with index (2)
          <div>//...page content</div>
        </Pager>
      </div>
    </>
  );
}
```

## Props

### orientation : _['horizontal' | 'vertical'] [optional]_

- Set `horizontal` or `vertical` scrolling orientation.
- If set to `vertical` make sure to provide a height value in `wrapperStyle` otherwise height will be set to `50vh`.
- **Default Value** `horizontal`

### initialPage : _[Number] [optional]_

- Index of initial page that should be selected on the first render.
- **Default Value** `0`

### loop : _[Boolean] [optional]_

- Loop scrolling between pages.
- **Note:** Loop scrolling doesn't work for touch swipe/drag scrolling.
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

- Wither to use animations when changing pages with mouse scroll wheel.
- **Default Value** `true`

### showScrollbar : _[Boolean] [optional]_

- Wither to show or hide pager scrollbar.
- **Default Value** `false`

### animationStyle : _['opacity' | 'scroll' | 'scale' | 'scaleX' | 'scaleY'] [optional]_

- Changing page animation style.
- **Note:** touch swipe/drag gestures always uses `scroll` animation style.
- **Default Value** `scroll`

### duration : _[Number] [optional]_

- Changing page animation duration in ms.
- **Default Value** `300`

### ease : _[String | Function] [optional]_

- Changing page animation transition timing function.
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

### onAnimation : _[ `(event: Object) => void` ] [optional]_

- This callback will be called every time animation frame changes, including touch swipe/drag.

|      Event props      |                        Description                        |  Type   |
| :-------------------: | :-------------------------------------------------------: | :-----: |
| `animationPercentage` |  Animation progress percentage, a value between (0 - 1)   | Number  |
|  `selectedPageIndex`  |         The page index that will be navigated to          | Number  |
|  `previousPageIndex`  |        The page index that will be navigated from         | Number  |
|     `touchSwipe`      | Wither the animation is coming from a touch swipe or not. | Boolean |

### onPageSelected : _[ `(selectedPageIndex: Number, previousPageIndex: Number) => void` ] [optional]_

- This callback will be called once the pager finishes navigating to the selected page.

### onPagerScroll : _[ `(event: Object) => void` ] [optional]_

- Executed when transitioning between pages (ether because the animation for the requested page has changed or when the user is
  swiping/dragging between pages).
- This is usefull for animating pages/tabs/slides indicators.

|    Event props     |                                     Description                                      |  Type  |
| :----------------: | :----------------------------------------------------------------------------------: | :----: |
| `scrollPercentage` | Pager scrolled length percentage relative to the first page, a value between (0 - 1) | Number |
|   `startingPos`    |                          Pager starting scrolling position                           | Number |
|    `currentPos`    |                           Pager current scrolling position                           | Number |
|   `scrollLength`   |              Pager scrolling width/height depends on pager orientation               | Number |
|      `event`       |                             Pager onscroll native event                              | Object |

## Methods

### next : `(withAnimation?: Boolean) => void`

- Navigate to the next page.
- Takes a boolean param to enable/disable animation.

### previous : `(withAnimation?: Boolean) => void`

- Navigate to the previous page.
- Takes a boolean param to enable/disable animation.

### setPage : `(pageIndex: Number, withAnimation?: Boolean) => void`

- Navigate to a specific page.
- Takes a number param (pageIndex) and a boolean param to enable/disable animation.

## Limitation

**horizontal orientation**

- Pager wrapper element height can't matches the viewed page height.
- Pager wrapper element height will match the heighest page you have.
- Even if you specify the pager height style to be shorter than the heighest page a scrollbar will show up.

**vertical orientation**

- Pager wrapper element width can't matches the viewed page width.
- Pager wrapper element width will match the widest page you have.
- Even if you specify the pager width style to be shorter than the widest page a scrollbar will show up.

<br />

- If necessary, you can workaround this by setting pages height/width programmatically with `overflow: 'hidden'` every time the
  page changes.
