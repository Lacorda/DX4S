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
    position: 'relative',
    width: '200px',
    height: '120px',
    border: '1px solid #ccc',
    background: '#fff',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    padding: '20px 40px',
    zIndex: 9999,
    margin: '200px auto',
    overflow: 'hidden',
  },
};
