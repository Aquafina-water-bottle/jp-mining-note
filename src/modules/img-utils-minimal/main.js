

/// {% set run %}

if ({{ utils.opt("modules", "img-utils", "enabled") }}) {
  // restricting the max height of image to the definition box
  const dhImgContainer = document.getElementById("dh_img_container");
  const READ_DHLEFT_HEIGHT = ((VW > {{ COMPILE_OPTIONS("breakpoints", "combine-picture").item() }})
      && ({{ utils.opt("modules", "img-utils", "resize-height-mode") }} === "same-height"));
  const newHeight = {{ utils.opt("modules", "img-utils", "resize-height-fixed-value") }};

  function adjustHeight(ele) {
    if (READ_DHLEFT_HEIGHT) {
      ele.style.maxHeight = HEIGHT_LEFT + "px";
    } else if ({{ utils.opt("modules", "img-utils", "resize-height-mode") }} === "fixed") {
      const newHeight = {{ utils.opt("modules", "img-utils", "resize-height-fixed-value") }};
      ele.style.maxHeight = newHeight + "px";
    }
  }


  let somethingDisplayed = dhImgContainer.innerHTML.length > 0;
  let HEIGHT_LEFT = 0;

  if (somethingDisplayed) {
    const dhLeft = document.getElementById("dh_left");
    const dhRight = document.getElementById("dh_right");
    if (READ_DHLEFT_HEIGHT) {
      HEIGHT_LEFT = dhLeft.offsetHeight;
    }
    adjustHeight(dhRight);

    const imgList = dhImgContainer.getElementsByTagName("img");
    if (imgList && imgList.length) {
      if (imgList.length >= 2) {
        logger.warn("There are more than 2 images in the Picture field. Use the PrimaryDefinitionPicture field if you wish to add more than one image.");
      }

      let image = imgList[0];
      image.classList.add("dh-right__img");
      adjustHeight(image); // restricts max height here too
    }

    // minimal version: not clickable by default
    const imgClickClassName = "dh-right__img-container--clickable";
    dhImgContainer.classList.remove(imgClickClassName);
  }
}

/// {% endset %}


