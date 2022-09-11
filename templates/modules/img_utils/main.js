
/// {% set functions %}


const JPMN_ImgUtils = (function () {

  let my = {};

  const modal = document.getElementById('modal');
  const modalImg = document.getElementById("bigimg");

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

      if (imgList && imgList.length === 1) {
        const img = dhImgContainer.getElementsByTagName("img")[0];
        img.classList.add("dh-right__img");
        img.style.maxHeight = heightLeft + "px"; // restricts max height here too

        img.onclick = function() {
          modal.style.display = "block";
          modalImg.src = this.src;
        }

      } else { // otherwise we hope that there are 0 images here
        // support for no images here: remove the fade-in / fade-out on text
        // the slightly hacky method is just to remove the class all together lol
        dhImgContainer.className = "";
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
          const fragment = createImgContainer(imgFileName);
          atag.parentNode.replaceChild(fragment, atag);
        }
      }

      // looks for user inserted images
      const imgTags = searchEle.getElementsByTagName("img");
      for (const imgEle of imgTags) {
        if (!imgEle.classList.contains("glossary__image-hover-media")) { // created by us
          const fragment = createImgContainer(imgEle.src);
          imgEle.parentNode.replaceChild(fragment, imgEle);
        }
      }
    }
  }

  function run() {
    editDisplayImage();

    // may have to disable this for template {edit:} functionality
    if ({{ utils.opt("image-utilities", "stylize-images-in-glossary") }}) {
      searchImages();
    }
  }


  my.run = run;
  return my;

}());



/// {% endset %}




/// {% set run %}

if ({{ utils.opt("image-utilities", "enabled") }}) {
  JPMN_ImgUtils.run();
}

/// {% endset %}

