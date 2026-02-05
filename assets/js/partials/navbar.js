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
  window.addEventListener('scroll', function () {
    var offset = -(window.scrollY || window.pageYOffset || document.body.scrollTop) / 5;
    document.getElementById("main").style.backgroundPosition = 'center ' + offset + 'px';
  });
});
