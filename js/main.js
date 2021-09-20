// Listen to "message" type events (insert MDN link)
window.addEventListener("message", handlePostMessage, false);
let dapi;
let msgQueue = {};
let alertQueue = [];
let context = "";
let lastSelectedEntryOsid;
let currentSelectedOSIDs = [];
let dashletName = "Dashlet";

function handlePostMessage(e) {
  // Ensure message comes from a trusted source (insert MDN link)
  const srcOrigin = "http://localhost" || "https://localhost";
  if (e.origin !== srcOrigin && e.origin !== srcOrigin) {
    return false;
  }

  const { type, data } = handleWebclientMessage(e.data);

  if (type === "onInit") {
    onInit(data);
  } else if (type === "onUpdate") {
    onInit(data);
    context = data.context;
  }
  return true;
}

function onInit(data) {
  console.log(`🚀 ~ file: main.js ~ line 27 ~ onInit ~ data`, data);
  dapi = window.dapi = data.dapi;
  dashletName =
    data.activeCustomDashlet[
      "title_" + data.sessionInfo.language.toUpperCase()
    ] || "Dashlet";
  lastSelectedEntryOsid = data.lastSelectedEntry.osid;
  currentSelectedOSIDs = data.selectedEntries.map((dmsInfo) => dmsInfo.osid);
}

async function openLocation() {
  const payload = [dapi.openLocation, ["false", lastSelectedEntryOsid]];

  try {
    await sendWebclientMessage(payload);
  } catch (error) {
    console.log(`dashlet says: error caught in openLocation`, error);
  }
}

async function openLocationNewTab() {
  const payload = [dapi.openLocation, ["true", lastSelectedEntryOsid]];

  try {
    await sendWebclientMessage(payload);
  } catch (error) {
    console.log(`dashlet says: error caught in openLocation in new tab`, error);
  }
}

async function openIndexData() {
  const payload = [
    dapi.openIndexData,
    ["false", "view", lastSelectedEntryOsid],
  ];

  try {
    await sendWebclientMessage(payload);
  } catch (error) {
    console.log(`dashlet says: error caught in openIndexData`, error);
  }
}

async function getSelectedObjects() {
  const payload = [dapi.getSelectedObjects, []];

  try {
    await sendWebclientMessage(payload, "*", true);
  } catch (error) {
    console.log(`dashlet says: error caught in getSelectedObjects`, error);
  }
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
