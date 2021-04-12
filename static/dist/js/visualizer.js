// Code for data exchange with visualizer.
window.addEventListener('message', (msg) => {
  const incoming = msg.data;
  if (incoming.request && incoming.request.cssSelector) {
    const cssSelector = incoming.request.cssSelector;
    const node = document.querySelectorAll(cssSelector)[0];
    const rects = node ? node.getBoundingClientRect() : null;

    // Send it asynchronously, once current event queue is done
    setTimeout(() => {
      (window.opener || window.parent)
        .postMessage({
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
        }, '*');
    }, 0);
  }
}, false);
