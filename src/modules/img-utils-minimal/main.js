

/// {% set run %}

if ({{ utils.opt("modules", "img-utils", "enabled") }}) {
  // restricting the max height of image to the definition box
  const dhImgContainer = document.getElementById("dh_img_container");
  let somethingDisplayed = dhImgContainer.innerHTML.length > 0;

  const ADJUST_HEIGHT = (VW > {{ COMPILE_OPTIONS("breakpoints", "combine-picture").item() }});
  let HEIGHT_LEFT = 0;

  if (somethingDisplayed) {
    const dhLeft = document.getElementById("dh_left");

    if (ADJUST_HEIGHT) {
      HEIGHT_LEFT = dhLeft.offsetHeight;
      const dhRight = document.getElementById("dh_right");
      dhRight.style.maxHeight = HEIGHT_LEFT + "px";
    }

    const imgList = dhImgContainer.getElementsByTagName("img");
    if (imgList && imgList.length) {
      if (imgList.length >= 2) {
        logger.warn("There are more than 2 images?");
      }

      let image = imgList[0];

      image.classList.add("dh-right__img");

      if (ADJUST_HEIGHT) {
        image.style.maxHeight = HEIGHT_LEFT + "px"; // restricts max height here too
      }
    }

    // minimal version: not clickable by default
    const imgClickClassName = "dh-right__img-container--clickable";
    dhImgContainer.classList.remove(imgClickClassName);
  }
}

/// {% endset %}


