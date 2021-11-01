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

- For touch swipe stability, if you have a scrollable page make sure that the scrollbar shows on the Pager wrapper element not on
  the HTML body.

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

- Set `horizontal` or `vertical` pages arrangement orientation.
- If you set it to `vertical` make sure to provide a `height` value in `wrapperStyle` prop otherwise it will be set to `50vh` by
  default.
- **Default Value** `horizontal`

### initialPage : _[Number] [optional]_

- Index of initial page that should be selected on the first render.
- **Default Value** `0`

### loop : _[Boolean] [optional]_

- Loop scrolling between pages.
- **Note:** Loop scrolling does not work for touch swipe/drag gestures.
- **Default Value** `false`

### touchGestures : _[Boolean] [optional]_

- Whether to enable or disable swipe/drag gestures for touch screens.
- **Default Value** `true`

### wrapperStyle : _[Object] [optional]_

- Pager wrapper element inline style.
- You can also use `id` or `className` attributes to add style from CSS StyleSheet.
- **Note:** Pager wrapper element has a flex box style by default.

### wheelScroll : _[Boolean] [optional]_

- Change pages by rotating mouse scroll wheel.
- **Default Value** `true`

### wheelScrollWithAnimation : _[Boolean] [optional]_

- Whether to use animation when changing pages with mouse scroll wheel or not.
- **Default Value** `true`

### showScrollbar : _[Boolean] [optional]_

- Whether to show or hide Pager scrollbar.
- Will show scrollbar on the bottom for `horizontal` orientation and on the left for `vertical` orientation.
- **Default Value** `false`

### animationStyle : _[ 'blur' | 'opacity' | 'scroll' | 'scale' | 'scaleX' | 'scaleY' | 'rotateX' | 'rotateY' ] [optional]_

- Animation style when navigating through pages.
- **Note:** touch swipe/drag gestures always uses `scroll` animation style.
- **Default Value** `scroll`

### perspective : _[Number] [optional]_

- 3d transform perspective value used only for `rotateX` and `rotateY` animation style.
- **Default Value** `1000`

### duration : _[Number] [optional]_

- Navigation animation duration in ms.
- **Default Value** `300`

### ease : _[ String | Function ] [optional]_

- Navigation animation transition timing function.
- Check [easings.net](https://easings.net/) to learn more.
- **Default Value** `easeOutExpo`
- If you want to provide your own timing-function make sure that the function takes one parameter and returns one value.

```javascript
function easeInQuad(x) {
  return x * x;
}
```

### adjustPagesSize : _[Boolean] [optional]_

- If you have pages with different `width` / `height` (depending on the `orientation` prop) this may causes unwanted extra space
  for the smaller pages.
- This method will adjust the unshowed (hidden) pages `width` / `height` (depending on the `orientation` prop) to match Pager
  wrapper element `width` / `height`.
- **Warning:** Don't use this if you have pages with specific `width` / `height` style, this method will overwrite them.
- Check [Limitation](#limitation) section.
- **Default Value** `false`

### onAnimation : _[ ( event: Object ) => void ] [optional]_

- This callback will be called every time animation frame changes, including touch swipe/drag gestures.

|      Event props      | Description                                                |  Type   |
| :-------------------: | ---------------------------------------------------------- | :-----: |
| `animationPercentage` | Animation progress percentage, a value between (0 - 1).    | Number  |
|  `selectedPageIndex`  | The page index that will be navigated to.                  | Number  |
|  `previousPageIndex`  | The page index that will be navigated from.                | Number  |
|     `touchSwipe`      | Whether the animation is coming from a touch swipe or not. | Boolean |

### onNavigationStart : _[ ( selectedPageIndex: Number, previousPageIndex: Number ) => void ] [optional]_

- This callback will be called once the pager starts navigating to the selected page.
- **Note:** this callback will be called on the first render too.

|       Params        | Description                                 |  Type  |
| :-----------------: | ------------------------------------------- | :----: |
| `selectedPageIndex` | The page index that will be navigated to.   | Number |
| `previousPageIndex` | The page index that will be navigated from. | Number |

### onPageSelected : _[ ( selectedPageIndex: Number, previousPageIndex: Number ) => void ] [optional]_

- This callback will be called once the pager finishes navigating to the selected page.
- **Note:** this callback will be called on the first render too.

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

### next : ( withAnimation?: Boolean = true ) => void

- Navigate to the next page.
- Takes a boolean param to enable/disable animation.

### previous : ( withAnimation?: Boolean = true ) => void

- Navigate to the previous page.
- Takes a boolean param to enable/disable animation. 

### setPage : ( pageIndex: Number, withAnimation?: Boolean = true ) => void

- Navigate to a specific page index.
- Takes a number param (pageIndex) and a boolean param to enable/disable animation.

## Limitation

- The limitation only apply if you have different pages \*`dimensions` .
- The \*`dimension` of the Pager wrapper element does not match the currently selected page \*`dimension`, it will match the
  `highest` or `widest` page you have.
- Even if you specify the Pager wrapper element \*`dimension` to be shorter than the `highest` or `widest` page, a scrollbar will
  show up.
- If necessary, you can workaround this by setting [adjustPagesSize](#adjustpagessize--boolean-optional) prop to `true`.
- ( \* ) **dimension:** `height` in case of `horizontal` orientation, `width` in case of `vertical` orientation.

![](https://github.com/alabsi91/react-js-pager/blob/c8c35cc4d038bff94c7957c93f6ac556f5c44265/limitation.jpg)
