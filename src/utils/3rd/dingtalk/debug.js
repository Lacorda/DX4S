/* eslint-disable no-underscore-dangle*/

export function timeStart(stage) {
  if (window._dxDebugMode) window._dxDebugStart(stage);
}

export function timeEnd(stage) {
  if (window._dxDebugMode) window._dxDebugEnd(stage);
}
