// cryoet_data_portal_docsite_faq.html?target=data-schema&status=open
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of the "open" or "closed" parameter
    const status = urlParams.get("status");
    const target = urlParams.get("target");

    // Get the div element
    const divElement = document.getElementById(target);

    // Add the "open" attribute to the details class based
    // on the value of the status parameter

    if (status === "open") {
        divElement.setAttribute('open', '');
    }
});
