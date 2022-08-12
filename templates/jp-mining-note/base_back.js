/// {% extends "cards/base.js" %}

/// {% block js_functions %}
  {{ super() }}

  // creates a custom image container to hold yomichan images
  function createImgContainer(imgName) {
    // creating this programmically:
    // <span class="glossary__image-container">
    //   <a class="glossary__image-hover-text" href='javascript:;'>[Image]</a>
    //   <img class="glossary__image-hover-media" src="${imgName}">
    // </span>

    var defSpan = document.createElement('span');
    defSpan.classList.add("glossary__image-container");

    var defAnc = document.createElement('a');
    defAnc.classList.add("glossary__image-hover-text");
    defAnc.href = "javascript:;'>[Image]";
    defAnc.textContent = "[Image]";

    var defImg = document.createElement('img');
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
/// {% endblock %}




/// {% block js_run %}
  {{ super() }}

  // checks leech
  var tags = "{{ T('Tags') }}".split(" ");
  if (tags.includes("leech")) {
    logger.leech();
  }


  // a bit of a hack...
  // The only reason why the downstep arrow exists in the first place is to make the downstep
  // mark visible while editing the field in anki. Otherwise, there is no reason for it to exist.
  var wp = document.getElementById("dh_word_pitch");
  wp.innerHTML = wp.innerHTML.replace(/&#42780/g, "").replace(/ꜜ/g, "");


  var modal = document.getElementById('modal');
  var modalImg = document.getElementById("bigimg");

  // restricting the max height of image to the definition box
  var dhLeft = document.getElementById("dh_left");
  var dhRight = document.getElementById("dh_right");
  var heightLeft = dhLeft.offsetHeight;

  if (dhRight) {
    dhRight.style.maxHeight = heightLeft + "px";

    // setting up the modal styles and clicking
    var dhImgContainer = document.getElementById("dh_img_container");
    var imgList = dhImgContainer.getElementsByTagName("img");

    if (imgList && imgList.length === 1) {
      var img = dhImgContainer.getElementsByTagName("img")[0];
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


  // remove all jmdict english dict tags
  //var glossaryEle = document.getElementById("primary_definition");
  //glossaryEle.innerHTML = glossaryEle.innerHTML.replace(/, JMdict \(English\)/g, "");

  // goes through each blockquote and searches for yomichan inserted images
  let imageSearchElements = document.getElementsByTagName("blockquote");
  for (let searchEle of imageSearchElements) {
    let anchorTags = searchEle.getElementsByTagName("a");
    for (let atag of anchorTags) {
      let imgFileName = atag.getAttribute("href");
      if (imgFileName && imgFileName.substring(0, 25) === "yomichan_dictionary_media") {
        let fragment = createImgContainer(imgFileName);
        atag.parentNode.replaceChild(fragment, atag);
      }
    }
  }

/// {% endblock %}
