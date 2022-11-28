
/// {% set functions %}

// =============
//  Image Utils
// =============

const JPMNImgUtils = (() => {

  const logger = new JPMNLogger("img-utils");

  const modal = document.getElementById('modal');
  const modalImg = document.getElementById("bigimg");

  const dhLeft = document.getElementById("dh_left");
  const dhLeftAudioBtns = document.getElementById("dh_left_audio_buttons");
  const primaryDefBlockquote = document.getElementById("primary_definition");
  const primaryDefText = document.getElementById("primary_definition_text");
  const primaryDefRight = document.getElementById("primary_definition_right")
  const primaryDefLeft = document.getElementById("primary_definition_left")
  const primaryDefExtLinks = document.getElementById("external_links_primary_def_float");
  let HEIGHT_LEFT = 0;
  let TEXT_HEIGHT = 0
  let PIC_HEIGHT = 0


  const dhRight = document.getElementById("dh_right");
  const imgEye = document.getElementById("img_svg_eye"); // null on the front
  const imgEyePathEle = imgEye === null ? null : imgEye.children[0];
  const dhImgContainer = document.getElementById("dh_img_container");
  const dhImgBlur = document.getElementById("dh_img_container_nsfw_blur");

  const VALID_POS_OPTS = ["bottom", "top", "right", "auto-bottom", "auto-top"];
  const VALID_AUTO_POS_OPTS = ["auto-bottom", "auto-top"];

  // adjusts height even if it's tablet mode because the picture can be tall and skinny
  const READ_DHLEFT_HEIGHT = ((VW > {{ COMPILE_OPTIONS("breakpoints", "combine-picture").item() }})
      && ({{ utils.opt("modules", "img-utils", "resize-height-mode") }} === "auto-height"));
  const POS_RESULT = getPrimaryDefPicturePosition();
  const USE_LENIENCE = {{ utils.opt("modules", "img-utils", "primary-definition-picture", "use-lenience") }};
  const CALC_DEF_PIC_HEIGHT = (VALID_AUTO_POS_OPTS.includes(POS_RESULT) && USE_LENIENCE)

  // TODO?
  //const MOBILE_ATTEMPT_PLACE_AROUND = false;
  // https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
  //const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

  const imgClickClassName = "dh-right__img-container--clickable";
  const showEyeClassName = "dh-right__show-eye";
  const nsfwBlurInitClassName = "nsfw-blur-init";
  const nsfwBlurClassName = "nsfw-blur";
  const nsfwNoBlurClassName = "nsfw-no-blur";

  const EYE_PATH_RAW = "M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z";
  const EYE_OFF_PATH_RAW = "M11.83 9 15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8 1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7Z";

  const TOGGLE_STATE_INDEX_KEY = "jpmn-image-blur-state-index";

  const TOGGLE_STATE_DISABLED = -1;
  const TOGGLE_STATE_ALWAYS_SHOWN = 0;
  const TOGGLE_STATE_ONLY_BLUR_NSFW = 1;
  const TOGGLE_STATE_ALWAYS_BLURRED = 2;

  // card side state for image eye
  let imgCurrentlyBlurred = false;
  let toggleStates = [];

  // main image, global variable
  let image = null;


  // gets the function to activate the modal with the img
  const getActivateModalFunc = function(image) {
    return function() {
      modal.style.display = "block";
      modalImg.src = image.src;
    }
  }

  // sets the image to be blurred
  const setImgBlur = function(init=false) {
    logger.debug("Setting image blur...", 2)

    dhImgContainer.classList.toggle(imgClickClassName, false);
    dhImgBlur.classList.toggle(nsfwNoBlurClassName, false);

    if (init) {
      dhImgBlur.classList.toggle(nsfwBlurInitClassName, true);
    } else {
      dhImgBlur.classList.toggle(nsfwBlurClassName, true);
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

    dhImgBlur.classList.toggle(nsfwBlurClassName, false);
    dhImgBlur.classList.toggle(nsfwBlurInitClassName, false);
    dhImgBlur.classList.add(nsfwNoBlurClassName);

    if (image !== null) {
      const activateModalFunc = getActivateModalFunc(image);
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

        settingsEyePathEle.classList.toggle(alwaysBlurredClass, false);

        if (displayPopup) {
          popupMenuMessage("No images will be blurred.");
        }
        break;

      case TOGGLE_STATE_ONLY_BLUR_NSFW:
        // should blur on nsfw images
        settingsEyePathEle.setAttributeNS(null, "d", EYE_OFF_PATH_RAW);
        settingsEyeTitleEle.textContent = "NSFW images are blurred by default. Click to toggle.";
        settingsEyePathEle.classList.toggle(alwaysBlurredClass, false);

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
          dhImgBlur.classList.toggle(showEyeClassName, false);
        }
        break;

      case 1: // ??? -> blur only if nsfw
        if (!cardHasNSFWTag()) {

          // can reach here on init as well
          removeImgBlur();

        } else if (!imgCurrentlyBlurred && cardHasNSFWTag()) {
          setImgBlur(init);
        }

        break;

      case 2: // ??? -> always blurred
        setImgBlur(init);
        if (!cardHasNSFWTag()) {
          dhImgBlur.classList.toggle(showEyeClassName, true);
        }
        break;

      default:
        logger.warning(`Invalid NSFW state: ${toggleState}`);
    }
  }


  function initPersistence() {
    let settingsEye = generateEyeSettingSVG();

    if (!{{ utils.opt("modules", "img-utils", "image-blur", "enabled") }}) {
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
  function createImgContainer(imgName, shouldBlur) {
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
    defAnc.textContent = "{{ TRANSLATOR.get('image-hover-text') }}";
    defAnc.setAttribute("data-suppress-link-hover", "true");

    const defImg = document.createElement('img');
    defImg.classList.add("glossary__image-hover-media");
    defImg.src = imgName;

    defImg.onclick = function() {
      modal.style.display = "block";
      modalImg.src = this.src;
    }

    // prevents clicking on the image link to zoom (on mobile)
    if (!isMobile()) {
      defAnc.onclick = function() {
        modal.style.display = "block";
        modalImg.src = defImg.src;
      }
    }

    defSpan.appendChild(defAnc);
    defSpan.appendChild(defImg);

    return defSpan;
  }

  function generateEyeSettingSVG() {
    const x = document.getElementById("hidden_svg_settings_toggle_img_blur")
    let result = x.children[0].cloneNode(true);
    return result;
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
      dhImgBlur.classList.toggle(showEyeClassName, true);
    }

    let toggleState = getCurrentNSFWToggleState();
    setImageBlurToState(toggleState, /*init=*/true);
  }


  function useModalAndBlur() {

    if ({{ utils.opt("modules", "img-utils", "image-blur", "enabled") }}) {
      useNSFWToggle();
    } else {
      image.onclick = getActivateModalFunc(image);
    }
  }

  function setToggleStatesIfEmpty() {
    // toggleStates is module-global
    // TODO change this option to use the {"type": "pc-mobile"}
    if (toggleStates.length === 0) {
      toggleStates = {{ utils.opt("modules", "img-utils", "image-blur", "toggle-states") }};
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

  //function getTags() {
  //  return document.getElementById("tags").innerText.split(" ");
  //}

  // checks if A is a subset of B
  // in other words, if any item in A is in B
  function checkArrayIsSubset(A, B) {
    for (item of A) {
      if (B.includes(item)) {
        return true;
      }
    }
    return false;
  }

  function cardHasNSFWTag() {
    //const tags = getTags();
    const nsfwTags = {{ utils.opt("modules", "img-utils", "image-blur", "tags") }};

    return checkArrayIsSubset(nsfwTags, TAGS_LIST);
  }

  function cardContainsAllTags(tagList) {
    //const tags = document.getElementById("tags").innerText.split(" ");

    let count = 0;
    for (t of tagList) {
      if (TAGS_LIST.includes(t)) {
        count += 1;
      }
    }

    return (count === tagList.length);
  }

  function getPrimaryDefPicturePosition() {
    let posResult = null;

    const posOpt = {{ utils.opt("modules", "img-utils", "primary-definition-picture", "position") }};
    const tagsBottom = {{ utils.opt("modules", "img-utils", "primary-definition-picture", "tags-bottom") }};
    const tagsTop = {{ utils.opt("modules", "img-utils", "primary-definition-picture", "tags-top") }};
    const tagsRight = {{ utils.opt("modules", "img-utils", "primary-definition-picture", "tags-right") }};

    if (checkArrayIsSubset(tagsBottom, TAGS_LIST)) { // priority on tag
      posResult = "bottom";
    } else if (checkArrayIsSubset(tagsRight, TAGS_LIST)) {
      posResult = "right";
    } else if (checkArrayIsSubset(tagsTop, TAGS_LIST)) {
      posResult = "top";
    } else if (VALID_POS_OPTS.includes(posOpt)) { // lower priority on default position
      posResult = posOpt;
    } else {
      logger.warn(`Invalid option value for 'modules.img-utils.primary-definition-picture.position': ${posOpt}. Defaulting to auto-bottom.`);
      posResult = "auto-bottom";
    }

    return posResult;

  }

  function adjustHeight(ele) {
    if (READ_DHLEFT_HEIGHT) {
      ele.style.maxHeight = HEIGHT_LEFT + "px";
    } else if ({{ utils.opt("modules", "img-utils", "resize-height-mode") }} === "fixed") {
      const newHeight = {{ utils.opt("modules", "img-utils", "resize-height-fixed-value") }};
      ele.style.maxHeight = newHeight + "px";
    }
  }


  function editDisplayImage() {
    // edits the display image width/height
    // makes the display image clickable to zoom
    // makes the modal clickable to un-zoom

    // restricting the max height of image to the definition box
    // TODO this one line of code seems to reflow the document, causing noticeable delay in the js
    // https://stackoverflow.com/questions/45960181/what-is-the-fastest-way-to-get-height-width-of-unstyled-element-in-javascript
    // https://stackoverflow.com/questions/19815810/avoiding-html-document-reflows/19816067#19816067

    // this appears to be the main bottleneck in performance for some awful reason
    // and it seems virtually impossible to remove it...
    // the best I can do is group all the calls together so only the first .offsetHeight read
    // slows the program down.
    // This code also CANNOT be placed at the top where global variables are defined,
    // because the height is dependent on the height of the resulting pitch accent.
    // Even if the code could be placed at the top, it still seems to cause a reflow,
    // so nothing has changed...


    if (READ_DHLEFT_HEIGHT || CALC_DEF_PIC_HEIGHT) {
      HEIGHT_LEFT = dhLeft === null ? 0 : dhLeft.offsetHeight;
      TEXT_HEIGHT = primaryDefText === null ? 0 : primaryDefText.offsetHeight;
      PIC_HEIGHT = primaryDefRight === null ? 0 : primaryDefRight.offsetHeight;
    }


    let somethingDisplayed = dhImgContainer.innerHTML.length > 0;

    // attempts to add image according to the tag
    const addTagsInfo = {{ utils.opt("modules", "img-utils", "add-image-if-contains-tags") }};
    if (!somethingDisplayed && addTagsInfo) {
      for (const info of addTagsInfo) {
        const tags = info["tags"];
        const fileName = info["file-name"];

        if (cardContainsAllTags(tags)) {
          const newImg = document.createElement('img');
          newImg.src = fileName;
          dhImgContainer.appendChild(newImg);
          dhRight.classList.add("dh-right--contains-image");
          dhLeftAudioBtns.classList.add("dh-left__audio-buttons--left");
          somethingDisplayed = true;

          break;
        }
      }
    }

    if (somethingDisplayed) {
      adjustHeight(dhRight);

      // setting up the modal styles and clicking
      const imgList = dhImgContainer.getElementsByTagName("img");

      if (imgList && imgList.length) {
        if (imgList.length >= 2) {
          logger.warn("There are more than 2 images in the Picture field. Use the PrimaryDefinitionPicture field if you wish to add more than one image.");
        }

        // module-global variable
        image = imgList[0];

        image.classList.add("dh-right__img");

        adjustHeight(image); // restricts max height here too

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
    //const imageSearchElements = document.getElementsByTagName("blockquote");
    const imageSearchElements = document.querySelectorAll("blockquote.glossary-blockquote .glossary-text");
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
          const shouldBlur = !!imgEle.getAttribute("data-blur-image"); // double ! casts to bool
          const fragment = createImgContainer(imgEle.src, shouldBlur);
          imgEle.parentNode.replaceChild(fragment, imgEle);
        }
      }
    }
  }

  function setDefPicPosition() {
    // if the field is empty, nothing has to be done
    if (!"{{ utils.any_of_str('PrimaryDefinitionPicture') }}") {
      logger.debug("PrimaryDefinitionPicture is empty. Nothing has to be done.");
      return;
    }


    // looks for the PrimaryDefinitionPicture if it exists
    // placed after image searches to allow main definition to be properly resized first
    for (const picEle of [primaryDefRight, primaryDefLeft]) {
      if (picEle === null) {
        continue;
      }
      const imgs = picEle.getElementsByTagName("img");
      for (const imgEle of imgs) {
        if (imgEle !== null) {
          imgEle.onclick = getActivateModalFunc(imgEle);
          imgEle.classList.add(imgClickClassName);
        }
      }
    }

    let posResult = POS_RESULT;

    let removeNoLenienceCls = true;

    if (VALID_AUTO_POS_OPTS.includes(posResult)) {
      // compares height of definition text and image
      let shouldFloat = null;

      if (USE_LENIENCE) {
        const lenience = {{ utils.opt("modules", "img-utils", "primary-definition-picture", "position-lenience") }};

        // comparison is still valid even if both textHeight and picHeight are 0
        // (picHeight is 0 if no text because without javascript, auto-no-lenience class is enabled)
        const textHeight = TEXT_HEIGHT * lenience;
        const picHeight = PIC_HEIGHT;
        shouldFloat = textHeight > picHeight;
        logger.debug(`shouldFloat=${shouldFloat}, textHeight=${textHeight}, picHeight=${picHeight}`);

        if (posResult === "auto-bottom") {
          posResult = shouldFloat ? "right" : "bottom";
        } else {
          posResult = shouldFloat ? "right" : "top";
        }

      } else {
        // simply adds the appropriate class
        // not using lenience means that:
        // if the definition is empty:
        //     place to left
        // else:
        //     placed to right
        removeNoLenienceCls = false;
      }
    }

    if (removeNoLenienceCls) {
      primaryDefBlockquote.classList.toggle("glossary-primary-definition--auto-no-lenience", false);
    }

    logger.debug(`PrimaryDefinitionPicture position: ${posResult}`);

    // nothing has to be done for "right" as that is the default
    if (posResult === "bottom") {
      primaryDefBlockquote.classList.add("glossary-blockquote--picture-below");
    } else if (posResult === "top") {
      primaryDefBlockquote.classList.add("glossary-blockquote--picture-above");
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

      if ({{ utils.opt("modules", "img-utils", "primary-definition-picture", "enabled") }}) {
        setDefPicPosition();
      }
    }
  }


  return JPMNImgUtils;

})();



/// {% endset %}




/// {% set run %}

if ({{ utils.opt("modules", "img-utils", "enabled") }}) {
  const imgUtils = new JPMNImgUtils();
  imgUtils.run();
}

/// {% endset %}


/// {% set run_front %}

if ({{ utils.opt("modules", "img-utils", "enabled") }} && {{ utils.opt("modules", "img-utils", "image-blur", "enabled") }}) {
  // ran just to call constructor
  const imgUtils = new JPMNImgUtils();
}

/// {% endset %}

