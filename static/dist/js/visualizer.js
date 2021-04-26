// Code for data exchange with visualizer.
window.addEventListener('message', (msg) => {
  const incoming = msg.data;

  // set VIZ_SOURCE and VIZ_ORIGIN during first postMessage
  // if req coming from webview enabled Visualizer
  if (typeof msg.data.request !== 'undefined' && msg.data.request.isEventSrcRequest) {
    window.VIZ_SOURCE = msg.source;
    window.VIZ_ORIGIN = msg.origin;
  }

  if (incoming.request && incoming.request.cssSelector) {
    const cssSelector = incoming.request.cssSelector;
    const node = document.querySelectorAll(cssSelector)[0];
    const rects = node ? node.getBoundingClientRect() : null;

    // Send it asynchronously, once current event queue is done
    setTimeout(() => {
      getVizSource().postMessage({
          namespace: 'marketplace',
          msg_id: incoming.msg_id,
          msg_type: 'RESPONSE', // REQUEST/RESPONSE/POST
          // Send back actual request message, to map responses
          status: {
            code: 200,
          },
          // Stringification of rects is giving empty object.
          result: {
            context: 'dom', // 'datapanel' incase of Data panel
            rects: rects
              ? {
                left: rects.left,
                top: rects.top,
                width: rects.width,
                height: rects.height,
              }
              : null,
          },
        }, getVizOrigin());
    }, 0);
  }
}, false);


function getVizSource() {
  return window.VIZ_SOURCE || window.parent;
}

function getVizOrigin() {
  return window.VIZ_ORIGIN || '*';
}
