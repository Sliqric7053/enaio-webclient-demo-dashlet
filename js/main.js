import * as lib from "./library.js";

// Listen to "message" type events (insert MDN link)
window.addEventListener("message", handlePostMessage, false);
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

  const { type, data } = lib.handleWebclientMessage(e.data);

  if (type === "onInit") {
    onInit(data);
  } else if (type === "onUpdate") {
    onInit(data);
    context = data.context;
    // TODO: Add info relating to this log in the Doku
    // "context" will be made available (in the onInit event) in a later enaio webclient service release.
    console.log(`Current context`, context);
  }
  return true;
}

function onInit(data) {
  dashletName =
    data.activeCustomDashlet[
      "title_" + data.sessionInfo.language.toUpperCase()
    ] || "Dashlet";
  lastSelectedEntryOsid = data.lastSelectedEntry.osid;
  currentSelectedOSIDs = data.selectedEntries.map((dmsInfo) => dmsInfo.osid);
}

async function openLocation() {
  const payload = ["openLocation", ["false", lastSelectedEntryOsid]];

  try {
    await lib.sendWebclientMessage(payload);
  } catch (error) {
    console.log(`dashlet says: error caught in openLocation`, error);
  }
}

async function openLocationNewTab() {
  const payload = ["openLocation", ["true", lastSelectedEntryOsid]];

  try {
    await lib.sendWebclientMessage(payload);
  } catch (error) {
    console.log(`dashlet says: error caught in openLocation in new tab`, error);
  }
}

async function openIndexData() {
  const payload = ["openIndexData", ["false", "view", lastSelectedEntryOsid]];

  try {
    await lib.sendWebclientMessage(payload);
  } catch (error) {
    console.log(`dashlet says: error caught in openIndexData`, error);
  }
}

async function getSelectedObjects() {
  const payload = ["getSelectedObjects", []];

  try {
    await lib.sendWebclientMessage(payload, "*", true);
  } catch (error) {
    console.log(`dashlet says: error caught in getSelectedObjects`, error);
  }
}

export { openLocation, openLocationNewTab, openIndexData, getSelectedObjects };
