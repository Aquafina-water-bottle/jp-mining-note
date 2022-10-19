
/// {% set functions %}

// =============
//  Image Utils
// =============

const JPMNImgUtils = (() => {

  const logger = new JPMNLogger("img-utils");

  const modal = document.getElementById('modal');
  const modalImg = document.getElementById("bigimg");

  const imgEye = document.getElementById("img_svg_eye"); // null on the front
  const imgEyePathEle = imgEye === null ? null : imgEye.children[0];
  const dhImgContainer = document.getElementById("dh_img_container");
  const dhImgBlur = document.getElementById("dh_img_container_nsfw_blur");

  const imgClickClassName = "dh-right__img-container--clickable";
  const showEyeClassName = "dh-right__show-eye";
  const nsfwBlurInitClassName = "nsfw-blur-init";
  const nsfwBlurClassName = "nsfw-blur";
  const nsfwNoBlurClassName = "nsfw-no-blur";

  const EYE_PATH_RAW = "M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z";
  const EYE_OFF_PATH_RAW = "M11.83 9 15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8 1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7Z";

  const TOGGLE_STATE_INDEX_KEY = "jpmn-nsfw-toggle-state-index";

  const TOGGLE_STATE_DISABLED = -1;
  const TOGGLE_STATE_ALWAYS_SHOWN = 0;
  const TOGGLE_STATE_ONLY_BLUR_NSFW = 1;
  const TOGGLE_STATE_ALWAYS_BLURRED = 2;

  // card side state for image eye
  let imgCurrentlyBlurred = false;
  let toggleStates = [];

  // main image
  let image = null;


  // helper function: removes the class from the classlist if it exist
  const removeIfExists = function(ele, name) {
    if (ele.classList.contains(name)) {
      ele.classList.remove(name);
    }
  }

  // gets the function to activate the modal with the img
  const getActivateModalFunc = function() {
    return function() {
      modal.style.display = "block";
      modalImg.src = image.src;
    }
  }

  // sets the image to be blurred
  const setImgBlur = function(init=false) {
    logger.debug("Setting image blur...", 2)

    removeIfExists(dhImgContainer, imgClickClassName);
    removeIfExists(dhImgBlur, nsfwNoBlurClassName);

    if (init) {
      dhImgBlur.classList.add(nsfwBlurInitClassName);
    } else {
      dhImgBlur.classList.add(nsfwBlurClassName);
    }

    if (image !== null) {
      image.onclick = null;
    }
    imgEyePathEle.setAttributeNS(null, "d", EYE_OFF_PATH_RAW);

    imgCurrentlyBlurred = true;
  }

  // doesn't require the image to be currently blurred for this function to be ran
  const removeImgBlur = function() {
    logger.debug("Removing image blur...", 2)

    dhImgContainer.classList.add(imgClickClassName);

    removeIfExists(dhImgBlur, nsfwBlurClassName);
    removeIfExists(dhImgBlur, nsfwBlurInitClassName);
    dhImgBlur.classList.add(nsfwNoBlurClassName);

    if (image !== null) {
      const activateModalFunc = getActivateModalFunc()
      image.onclick = activateModalFunc;
    }
    imgEyePathEle.setAttributeNS(null, "d", EYE_PATH_RAW);

    imgCurrentlyBlurred = false;
  }

  // sets display state of settings eye
  function setDisplayState(state, settingsEye, displayPopup=true) {
    let settingsEyePathEle = settingsEye.children[0];
    let settingsEyeTitleEle = settingsEye.children[1];
    const alwaysBlurredClass = "info-circle-text-settings__svg--red";
    const settingsDisabledClass = "info-circle-text-settings__svg--disabled";

    switch (state) {
      case TOGGLE_STATE_DISABLED:
        settingsEyeTitleEle.textContent = "Persistence is not available. This option cannot be set.";
        settingsEyePathEle.classList.add(settingsDisabledClass);

        if (getShouldBlurNSFWDefault()) {
          settingsEyePathEle.setAttributeNS(null, "d", EYE_OFF_PATH_RAW);
        } else {
          settingsEyePathEle.setAttributeNS(null, "d", EYE_PATH_RAW);
        }
        break;

      case TOGGLE_STATE_ALWAYS_SHOWN:
        // never blurs
        settingsEyePathEle.setAttributeNS(null, "d", EYE_PATH_RAW);
        settingsEyeTitleEle.textContent = "NSFW images are not blurred by default. Click to toggle.";

        removeIfExists(settingsEyePathEle, alwaysBlurredClass);

        if (displayPopup) {
          popupMenuMessage("No images will be blurred.");
        }
        break;

      case TOGGLE_STATE_ONLY_BLUR_NSFW:
        // should blur on nsfw images
        settingsEyePathEle.setAttributeNS(null, "d", EYE_OFF_PATH_RAW);
        settingsEyeTitleEle.textContent = "NSFW images are blurred by default. Click to toggle.";
        removeIfExists(settingsEyePathEle, alwaysBlurredClass);

        if (displayPopup) {
          popupMenuMessage("NSFW images will be blurred.");
        }
        break;

      case TOGGLE_STATE_ALWAYS_BLURRED:
        // always blurs on nsfw images
        settingsEyePathEle.setAttributeNS(null, "d", EYE_OFF_PATH_RAW);
        settingsEyePathEle.classList.add(alwaysBlurredClass);
        settingsEyeTitleEle.textContent = "All images are blurred. Click to toggle.";

        if (displayPopup) {
          popupMenuMessage("All images will be blurred.");
        }
        break;
    }
  }

  function setImageBlurToState(toggleState, init=false) {
    if (imgEye == null) {
      return;
    }

    logger.debug(`Setting blur state to '${toggleState}' ...`, 2);
    switch (toggleState) {
      case 0: // ??? -> never blurred
        removeImgBlur();
        if (!cardHasNSFWTag()) {
          // removes if necessary (non-nsfw image forced to be blurred -> no longer forced)
          removeIfExists(dhImgBlur, showEyeClassName);
        }
        break;

      case 1: // ??? -> blur only if nsfw
        if (!cardHasNSFWTag()) {

          // can reach here on init as well
          removeImgBlur();

          if (imgCurrentlyBlurred) {
            // removes if necessary (non-nsfw image forced to be blurred -> no longer forced)
            removeIfExists(dhImgBlur, showEyeClassName);
          }

        } else if (!imgCurrentlyBlurred && cardHasNSFWTag()) {
          setImgBlur(init);
        }

        break;

      case 2: // ??? -> always blurred
        setImgBlur(init);
        if (!cardHasNSFWTag()) {
          dhImgBlur.classList.add(showEyeClassName);
        }
        break;

      default:
        logger.warning(`Invalid NSFW state: ${toggleState}`);
    }
  }


  function initPersistence() {
    let settingsEye = generateEyeSettingSVG();

    if (!{{ utils.opt("modules", "img-utils", "nsfw-toggle", "enabled") }}) {
      // persistence only needs to be initialized if nsfw toggle is enabled
      return;
    } else {
      logger.debug("NSFW toggle enabled");
    }

    // inits persistence key
    const infoCircleSettings = document.getElementById("info_circle_text_settings");

    if (Persistence.isAvailable()) {
      if (Persistence.getItem(TOGGLE_STATE_INDEX_KEY) === null) {
        logger.debug(`First review, setting Persistence to ${0}`);
        Persistence.setItem(TOGGLE_STATE_INDEX_KEY, 0);
      } else {
        logger.debug("Persistence is available. Not the first review, so nothing has to be done.");
      }
    } else {
      logger.debug("Persistence is not available! Unable to init Persistence");
    }

    // visual interface for whether images should be blurred or not
    infoCircleSettings.appendChild(settingsEye);

    if (Persistence.isAvailable()) {

      // allows the usage of the global option
      settingsEye.onclick = function() {
        setNextNSFWToggleState();
        let toggleState = getCurrentNSFWToggleState();
        setImageBlurToState(toggleState)
        setDisplayState(toggleState, settingsEye);
      }

      // to display properly on the settings eye
      logger.debug(`Setting NSFW toggle state to '${getCurrentNSFWToggleState()}'...`);
      setDisplayState(getCurrentNSFWToggleState(), settingsEye, false);

    } else {
      setDisplayState(TOGGLE_STATE_DISABLED, settingsEye, false);
    }
  }


  // creates a custom image container to hold yomichan images
  function createImgContainer(imgName) {
    // creating this programmically:
    // <span class="glossary__image-container">
    //   <a class="glossary__image-hover-text" href='javascript:;'</a>
    //   <img class="glossary__image-hover-media" src="${imgName}">
    // </span>

    const defSpan = document.createElement('span');
    defSpan.classList.add("glossary__image-container");

    const defAnc = document.createElement('a');
    defAnc.classList.add("glossary__image-hover-text");
    defAnc.href = "javascript:;";
    defAnc.textContent = "[Image]";

    const defImg = document.createElement('img');
    defImg.classList.add("glossary__image-hover-media");
    defImg.src = imgName;

    defImg.onclick = function() {
      modal.style.display = "block";
      modalImg.src = this.src;
    }

    defAnc.onclick = function() {
      modal.style.display = "block";
      modalImg.src = defImg.src;
    }

    defSpan.appendChild(defAnc);
    defSpan.appendChild(defImg);

    return defSpan;
  }

  function generateEyeSettingSVG() {
    // a bit of a hacky way to do it without dealing with a bunch of raw js
    const svgStr = '<svg id="settings_nsfw_toggle_eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z"/><title>Toggle blur</title></svg>';

    const x = document.createElement("span");
    x.innerHTML = svgStr;
    return x.children[0];
  }

  function useNSFWToggle() {

    imgEye.onclick = function() {
      if (imgCurrentlyBlurred) { // should be blurred -> not blurred
        removeImgBlur();
      } else { // not blurred -> should be blurred
        setImgBlur();
      }
    }

    const imgIsNsfw = cardHasNSFWTag();
    const shouldBlurImgDefault = getShouldBlurNSFWDefault();
    logger.debug(`imgIsNsfw: ${imgIsNsfw}, shouldBlurImgDefault: ${shouldBlurImgDefault}`);

    if (imgIsNsfw) {
      dhImgBlur.classList.add(showEyeClassName);
    }

    let toggleState = getCurrentNSFWToggleState();
    setImageBlurToState(toggleState, /*init=*/true);
  }


  function useModalAndBlur() {

    if ({{ utils.opt("modules", "img-utils", "nsfw-toggle", "enabled") }}) {
      useNSFWToggle();
    } else {
      image.onclick = getActivateModalFunc();
    }
  }

  function setToggleStatesIfEmpty() {
    // toggleStates is module-global
    if (toggleStates.length === 0) {
      let onMobile = document.documentElement.classList.contains('mobile');
      if (onMobile) {
        toggleStates = {{ utils.opt("modules", "img-utils", "nsfw-toggle", "toggle-states-mobile") }};
      }
      toggleStates = {{ utils.opt("modules", "img-utils", "nsfw-toggle", "toggle-states-pc") }};
    }
  }

  function getDefaultNSFWToggleState() {
    setToggleStatesIfEmpty();
    return toggleStates[0];
  }

  function getCurrentNSFWToggleState() {
    setToggleStatesIfEmpty();
    if (Persistence.isAvailable()) {
      const currentStateIndex = Persistence.getItem(TOGGLE_STATE_INDEX_KEY);
      const currentState = toggleStates[currentStateIndex]
      logger.debug(`Persistence[${currentStateIndex}] returns ${currentState}`, 1);
      return currentState;
    }
    logger.debug("Persistence not available! Falling back to default value...", 2);
    return toggleStates[0];
  }

  function setNextNSFWToggleState() {
    setToggleStatesIfEmpty();

    let currentStateIndex = Persistence.getItem(TOGGLE_STATE_INDEX_KEY);
    let nextStateIndex = (currentStateIndex + 1) % toggleStates.length;
    logger.debug(`Setting Persistence: ${nextStateIndex}`, 2)
    Persistence.setItem(TOGGLE_STATE_INDEX_KEY, nextStateIndex);

    return toggleStates[nextStateIndex];
  }


  function getShouldBlurNSFWDefault() {
    return (getDefaultNSFWToggleState() >= 1);
  }

  function cardHasNSFWTag() {
    const tags = document.getElementById("tags").innerText.split(" ");
    const nsfwTags = {{ utils.opt("modules", "img-utils", "nsfw-toggle", "tags") }};

    for (nsfwTag of nsfwTags) {
      if (tags.includes(nsfwTag)) {
        return true;
      }
    }
    return false;
  }


  function editDisplayImage() {
    // edits the display image width/height
    // makes the display image clickable to zoom
    // makes the modal clickable to un-zoom

    // restricting the max height of image to the definition box
    const dhLeft = document.getElementById("dh_left");
    const dhRight = document.getElementById("dh_right");
    const heightLeft = dhLeft.offsetHeight;

    if (dhRight) {
      dhRight.style.maxHeight = heightLeft + "px";

      // setting up the modal styles and clicking
      const dhImgContainer = document.getElementById("dh_img_container");
      const imgList = dhImgContainer.getElementsByTagName("img");

      if (imgList && imgList.length) {
        if (imgList.length >= 2) {
          logger.warn("There are more than 2 images?");
        }

        // module-global variable
        image = imgList[0];

        image.classList.add("dh-right__img");
        image.style.maxHeight = heightLeft + "px"; // restricts max height here too

        useModalAndBlur();

      } else { // otherwise we hope that there are 0 images here
        // support for no images here: remove the fade-in / fade-out on text
        logger.debug("No images found. Removing clickable class...");
        dhImgContainer.classList.remove(imgClickClassName);
      }
    }


    // close the modal upon click
    modal.onclick = function() {
      bigimg.classList.add("modal-img__zoom-out");
      modal.classList.add("modal-img__zoom-out");
      setTimeout(function() {
        modal.style.display = "none";
        bigimg.className = "modal-img";
        modal.className = "modal";
      }, 200);
    }

  }

  function searchImages() {

    // goes through each blockquote and searches for yomichan inserted images
    const imageSearchElements = document.getElementsByTagName("blockquote");
    for (const searchEle of imageSearchElements) {
      const anchorTags = searchEle.getElementsByTagName("a");
      for (const atag of anchorTags) {
        const imgFileName = atag.getAttribute("href");
        if (imgFileName && imgFileName.substring(0, 25) === "yomichan_dictionary_media") {
          logger.debug(`Converting yomichan image ${imgFileName}...`);
          const fragment = createImgContainer(imgFileName);
          atag.parentNode.replaceChild(fragment, atag);
        }
      }

      // looks for user inserted images
      const imgTags = searchEle.getElementsByTagName("img");
      for (const imgEle of imgTags) {
        if (!imgEle.classList.contains("glossary__image-hover-media") &&
            !(imgEle.getAttribute("data-do-not-convert"))
        ) { // created by us
          logger.debug(`Converting user-inserted image ${imgEle.src}...`);
          const fragment = createImgContainer(imgEle.src);
          imgEle.parentNode.replaceChild(fragment, imgEle);
        }
      }
    }
  }

  class JPMNImgUtils {
    constructor() {
      initPersistence()
    }

    run() {
      editDisplayImage();

      if ({{ utils.opt("modules", "img-utils", "stylize-images-in-glossary") }}) {
        searchImages();
      }
    }
  }


  return JPMNImgUtils;

})();



/// {% endset %}




/// {% set run %}

if ({{ utils.opt("modules", "img-utils", "enabled") }}) {
  const img_utils = new JPMNImgUtils();
  img_utils.run();
}

/// {% endset %}


/// {% set run_front %}

if ({{ utils.opt("modules", "img-utils", "enabled") }} && {{ utils.opt("modules", "img-utils", "nsfw-toggle", "enabled") }}) {
  // ran just to call constructor
  const img_utils = new JPMNImgUtils();
}

/// {% endset %}

