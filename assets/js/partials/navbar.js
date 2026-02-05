document.addEventListener("DOMContentLoaded", function (event) {

  /*
   * Display the menu items on smaller screens
   */
  var pull = document.getElementById('pull');
  var menu = document.querySelector('nav ul');


  ['click', 'touch'].forEach(function (e) {
    pull.addEventListener(e, function () {
      menu.classList.toggle('hide')
    }, false);
  });

  /*
   * Make the header images move on scroll
   * Start from top, move slightly on scroll
   */
  var mainElement = document.getElementById("main");

  function updateBackgroundPosition() {
    if (!mainElement) return;
    var offset = -(window.scrollY || window.pageYOffset || document.body.scrollTop) / 5;
    mainElement.style.backgroundPosition = 'center ' + offset + 'px';
  }

  // Set initial position immediately (handles page refresh at scroll position)
  updateBackgroundPosition();

  // Update on scroll
  window.addEventListener('scroll', updateBackgroundPosition);
});
