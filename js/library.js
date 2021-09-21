let msgQueue = {};
let alertQueue = [];

function handleWebclientMessage(payload) {
  if (payload.msgId && msgQueue[payload.msgId]) {
    if (payload.data.result !== undefined) {
      msgQueue[payload.msgId].resolve(payload.data.result);
    } else if (payload.data.error !== undefined) {
      msgQueue[payload.msgId].reject(payload.data.error);
    }

    if (alertQueue.includes(payload.msgId)) {
      alert(
        `alert for msgId ${payload.msgId}:\n${JSON.stringify(
          payload.data.result
        )}`
      );
      alertQueue.splice(alertQueue.indexOf(payload.msgId), 1);
    }

    delete msgQueue[payload.msgId];
  }

  return payload;
}

async function sendWebclientMessage(
  payload,
  targetOrigin = "*",
  triggerAlert = false
) {
  const msgId = Math.random().toString(36).substr(2, 8);
  payload.push({ msgId });

  if (triggerAlert) {
    alertQueue.push(msgId);
  }

  let _resolve, _reject;
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  msgQueue[msgId] = { resolve: _resolve, reject: _reject };

  window.parent.postMessage(payload, targetOrigin);
  return promise;
}

export { handleWebclientMessage, sendWebclientMessage };
