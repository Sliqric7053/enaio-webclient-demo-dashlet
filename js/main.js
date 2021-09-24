import * as lib from "./library.js";

// Listen to "message" type event.
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#the_dispatched_event
window.addEventListener("message", handlePostMessage, false);

let webclientOrigin;
let lastSelectedEntryOsid;
let currentSelectedOSIDs = [];
let dashletName = "Dashlet";

// A function responsible for processing all incoming "messages" from enaio® webclient.
function handlePostMessage(e) {
  webclientOrigin = e.origin;
  alert(`webclientOrigin : ${webclientOrigin}`);


  /* Ensure "messages" come from a trusted source i.e. your own enaio® hosted domain.
     Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns

     "srcOrigin" is the domain URL where enaio® webclient is served. Example: https://enaio.company-name.de

    //  Uncomment the below code and replace "srcOrigin" variable with your own enaio® webclient domain.
    const srcOrigin = "http://your-enaio-domain" || "https://your-enaio-domain";
    if (webclientOrigin !== srcOrigin) {
      return false;
    }
  */

  // "handleWebclientMessage" is a handler function which further processes all incoming "messages" from enaio® webclient (see implimentation details in the library.js file).
  // Extract the "type" and "data" properties for further processing.
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  const { type, data } = lib.handleWebclientMessage(e.data);
  let context = "";

  if (type === "onInit") {
    initDashlet(data);
    console.log(`onInit event data:`, data);
    // "context" will be made available (in the onInit type event) in a later enaio® webclient service release. (TODO)
  } else if (type === "onUpdate") {
    initDashlet(data);
    context = data.context;
    console.log(`Current context:`, context);
    console.log(`onUpdate event data:`, data);
  }
  return true;
}

//
/**
 * Initialize the dashlet by it feeding incoming enaio® webclient data.
 * @param data an object which contains enaio® webclient properties that the dashlet can use to enrich itself.
 * @returns The method has no return value.
 */
function initDashlet(data) {
  dashletName =
    data.activeCustomDashlet[
    "title_" + data.sessionInfo.language.toUpperCase()
    ] || "Dashlet";
  lastSelectedEntryOsid = data.lastSelectedEntry.osid;
  currentSelectedOSIDs = data.selectedEntries.map((dmsInfo) => dmsInfo.osid);
  // Uncomment the below code to see an array of the hitlist's currently osids.
  // console.log(`Currently selected osids`, currentSelectedOSIDs);
}

/**
 * Opens the location in the current browser tab (or a location selection in the case of several possible locations) for the DMS object transferred as a parameter.
 * @param null no arguments are required for this method.
 * @returns The method has no return value. You should provide them with a try-catch-block or error handler, since an error is triggered in the event of an error.
 * This would be caught in the catch block or error handler.
 * @link https://help.optimal-systems.com/enaio_develop/display/WEB/openLocation
 */
async function openLocation() {
  const payload = ["openLocation", ["false", lastSelectedEntryOsid]];

  try {
    // "sendWebclientMessage" is a handler function which is responsible for posting "messages" to the enaio® webclient (see implimentation details in the library.js file).
    await lib.sendWebclientMessage(payload, webclientOrigin);
  } catch (error) {
    console.log(`dashlet says: error caught in openLocation`, error);
  }
}

/**
 * Opens the location in a new browser tab (or a location selection in the case of several possible locations) for the DMS object transferred as a parameter.
 * @param null no arguments are required for this method.
 * @returns The method has no return value. You should provide them with a try-catch-block or error handler, since an error is triggered in the event of an error.
 * This would be caught in the catch block or error handler.
 * @link https://help.optimal-systems.com/enaio_develop/display/WEB/openLocation
 */
async function openLocationNewTab() {
  const payload = ["openLocation", ["true", lastSelectedEntryOsid]];

  try {
    // "sendWebclientMessage" is a handler function which is responsible for posting "messages" to the enaio® webclient (see implimentation details in the library.js file).
    await lib.sendWebclientMessage(payload, webclientOrigin);
  } catch (error) {
    console.log(`dashlet says: error caught in openLocation in new tab`, error);
  }
}

/**
 * Open indexdata mask for the currently selected osid.
 * @param null no arguments are required for this method.
 * @returns Boolean true if the objectId and objectTypeId were valid and the opening was successful. Otherwise false.
 * @link https://help.optimal-systems.com/enaio_develop/display/WEB/openIndexData
 */
async function openIndexData() {
  const payload = ["openIndexData", ["false", "view", lastSelectedEntryOsid]];

  try {
    // "sendWebclientMessage" is a handler function which is responsible for posting "messages" to the enaio® webclient (see implimentation details in the library.js file).
    await lib.sendWebclientMessage(payload, webclientOrigin);
  } catch (error) {
    console.log(`dashlet says: error caught in openIndexData`, error);
  }
}

/**
 * Query the currently selected objects.
 * @param null no arguments are required for this method.
 * @returns Depending on whether you call getSelectedObjects or the enaio® RichClient compatibility method,
 * you will get a different result. In the former, a JavaScript array with objects consisting of objectId and
 * objectTypeId of the selected DMS objects. With the compatibility method, a character sect that is separated
 * by a semicolon and returns a tuple from objectId and objectTypeId.
 * @link https://help.optimal-systems.com/enaio_develop/display/WEB/getSelectedObjects
 */
async function getSelectedObjects() {
  const payload = ["getSelectedObjects", []];

  try {
    // "sendWebclientMessage" is a handler function which is responsible for posting "messages" to the enaio® webclient (see implimentation details in the library.js file).
    await lib.sendWebclientMessage(payload, webclientOrigin, true);
  } catch (error) {
    console.log(`dashlet says: error caught in getSelectedObjects`, error);
  }
}

// Export functions to be used in other JavaScript files.
// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
export { openLocation, openLocationNewTab, openIndexData, getSelectedObjects };
