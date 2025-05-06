window.addEventListener("DOMContentLoaded", function () {
  versions = document.querySelectorAll(".md-version__item");
  const currentUrl = window.location.href;
  var currentVersion = currentUrl.match(/\/v\d+\.\d+(\-?rc\d+)?\/|\/dev\//g)[0];
  var splitUrl = currentUrl.split(currentVersion);
  versions.forEach((version) => {
    var url = version.querySelector("a").getAttribute("href")
    const redirectUrl = url + splitUrl[1];
    version.querySelector("a").setAttribute("href", redirectUrl);
  });
});
