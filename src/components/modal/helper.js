export default {};

export const BASE_PX = 75;
export const noop = function noop() {};
export const px2rem = x => `${(x / BASE_PX)}rem`;
export const style = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 9998,
  },
  content: {
    position: 'absolute',
    top: px2rem(300),
    left: px2rem(100),
    right: px2rem(100),
    bottom: 'initial',
    margin: '0 auto',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: px2rem(4),
    padding: px2rem(25),
    zIndex: 9999,
  },
};
