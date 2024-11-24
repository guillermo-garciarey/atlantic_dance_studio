/*
	Standout by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/

(function ($) {
    var $window = $(window),
        $body = $("body"),
        $header = $("#header"),
        $banner = $("#banner");

    // Breakpoints.
    breakpoints({
        xlarge: ["1281px", "1680px"],
        large: ["981px", "1280px"],
        medium: ["737px", "980px"],
        small: ["481px", "736px"],
        xsmall: ["361px", "480px"],
        xxsmall: [null, "360px"],
    });

    // Play initial animations on page load.
    $window.on("load", function () {
        window.setTimeout(function () {
            $body.removeClass("is-preload");
        }, 100);
    });

    // Scrolly.
    $(".scrolly").scrolly({
        offset: function () {
            return $header.height();
        },
    });

    // Header.
    if ($banner.length > 0 && $header.hasClass("alt")) {
        $window.on("resize", function () {
            $window.trigger("scroll");
        });

        $banner.scrollex({
            bottom: $header.outerHeight(),
            terminate: function () {
                $header.removeClass("alt");
            },
            enter: function () {
                $header.addClass("alt");
            },
            leave: function () {
                $header.removeClass("alt");
            },
        });
    }

    // Banner.
    var $banner = $("#banner");

    (function () {
        // Settings.
        var settings = {
            // Images (in the format of 'url': 'alignment').
            images: {
                "images/slides/background1.jpg": "35% 60%",
                "images/slides/background2.jpg": "center",
                "images/slides/background3.jpg": "center",
                "images/slides/background4.jpg": "10% 30%",
            },

            // Delay.
            delay: 6000,
        };

        // Vars.
        var pos = 0,
            lastPos = 0,
            $wrapper,
            $bgs = [],
            $bg,
            k,
            v;

        // Create BG wrapper, BGs.
        $wrapper = $('<div class="bg" />').appendTo($banner);

        for (k in settings.images) {
            // Create BG.
            $bg = $("<div />");
            $bg.css("background-image", 'url("' + k + '")');
            $bg.css("background-position", settings.images[k]);
            $bg.appendTo($wrapper);

            // Add it to array.
            $bgs.push($bg);
        }

        // Main loop.
        $bgs[pos].addClass("visible");
        $bgs[pos].addClass("top");

        // Bail if we only have a single BG or the client doesn't support transitions.
        if ($bgs.length == 1) return;

        setInterval(function () {
            lastPos = pos;
            pos++;

            // Wrap to beginning if necessary.
            if (pos >= $bgs.length) pos = 0;

            // Swap top images.
            $bgs[lastPos].removeClass("top");
            $bgs[pos].addClass("visible");
            $bgs[pos].addClass("top");

            // Hide last image after a short delay.
            setTimeout(function () {
                $bgs[lastPos].removeClass("visible");
            }, settings.delay / 2);
        }, settings.delay);
    })();

    // Gallery.
    $(".gallery")
        .on("click", "a", function (event) {
            var $a = $(this),
                $gallery = $a.parents(".gallery"),
                $modal = $gallery.children(".modal"),
                $modalImg = $modal.find("img"),
                href = $a.attr("href");

            // Not an image? Bail.
            if (!href.match(/\.(jpg|gif|png|mp4)$/)) return;

            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Locked? Bail.
            if ($modal[0]._locked) return;

            // Lock.
            $modal[0]._locked = true;

            // Set src.
            $modalImg.attr("src", href);

            // Set visible.
            $modal.addClass("visible");

            // Focus.
            $modal.focus();

            // Delay.
            setTimeout(function () {
                // Unlock.
                $modal[0]._locked = false;
            }, 600);
        })
        .on("click", ".modal", function (event) {
            var $modal = $(this),
                $modalImg = $modal.find("img");

            // Locked? Bail.
            if ($modal[0]._locked) return;

            // Already hidden? Bail.
            if (!$modal.hasClass("visible")) return;

            // Stop propagation.
            event.stopPropagation();

            // Lock.
            $modal[0]._locked = true;

            // Clear visible, loaded.
            $modal.removeClass("loaded");

            // Delay.
            setTimeout(function () {
                $modal.removeClass("visible");

                setTimeout(function () {
                    // Clear src.
                    $modalImg.attr("src", "");

                    // Unlock.
                    $modal[0]._locked = false;

                    // Focus.
                    $body.focus();
                }, 475);
            }, 125);
        })
        .on("keypress", ".modal", function (event) {
            var $modal = $(this);

            // Escape? Hide modal.
            if (event.keyCode == 27) $modal.trigger("click");
        })
        .on("mouseup mousedown mousemove", ".modal", function (event) {
            // Stop propagation.
            event.stopPropagation();
        })
        .prepend(
            '<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>'
        )
        .find("img")
        .on("load", function (event) {
            var $modalImg = $(this),
                $modal = $modalImg.parents(".modal");

            setTimeout(function () {
                // No longer visible? Bail.
                if (!$modal.hasClass("visible")) return;

                // Set loaded.
                $modal.addClass("loaded");
            }, 275);
        });

    // Menu.
    var $menu = $("#menu");

    $menu._locked = false;

    $menu._lock = function () {
        if ($menu._locked) return false;

        $menu._locked = true;

        window.setTimeout(function () {
            $menu._locked = false;
        }, 350);

        return true;
    };

    $menu._show = function () {
        if ($menu._lock()) $body.addClass("is-menu-visible");
    };

    $menu._hide = function () {
        if ($menu._lock()) $body.removeClass("is-menu-visible");
    };

    $menu._toggle = function () {
        if ($menu._lock()) $body.toggleClass("is-menu-visible");
    };

    $menu
        .appendTo($body)
        .on("click", function (event) {
            event.stopPropagation();

            // Hide.
            $menu._hide();
        })
        .find(".inner")
        .on("click", ".close", function (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            // Hide.
            $menu._hide();
        })
        .on("click", function (event) {
            event.stopPropagation();
        })
        .on("click", "a", function (event) {
            var href = $(this).attr("href");

            event.preventDefault();
            event.stopPropagation();

            // Hide.
            $menu._hide();

            // Redirect.
            window.setTimeout(function () {
                window.location.href = href;
            }, 350);
        });

    $body
        .on("click", 'a[href="#menu"]', function (event) {
            event.stopPropagation();
            event.preventDefault();

            // Toggle.
            $menu._toggle();
        })
        .on("keydown", function (event) {
            // Hide on escape.
            if (event.keyCode == 27) $menu._hide();
        });

    // Tabs.
    $(".tabs").selectorr({
        titleSelector: "h3",
        delay: 250,
    });
})(jQuery);

    // Accordion

    const accordion = document.querySelector(".accordion");

    accordion.addEventListener("click", (e) => {
        const activePanel = e.target.closest(".accordion-panel");
        if (!activePanel) return;
        toggleAccordion(activePanel);
    });

    function toggleAccordion(panelToActivate) {
        const buttons =
            panelToActivate.parentElement.querySelectorAll("button");
        const contents =
            panelToActivate.parentElement.querySelectorAll(
                ".accordion-content"
            );

        buttons.forEach((button) => {
            button.setAttribute("aria-expanded", false);
        });

        contents.forEach((content) => {
            content.setAttribute("aria-hidden", true);
        });

        panelToActivate
            .querySelector("button")
            .setAttribute("aria-expanded", true);

        panelToActivate
            .querySelector(".accordion-content")
            .setAttribute("aria-hidden", false);
    }

    // Accordion European

    const accordion_euro = document.querySelector(".accordion_euro");

    accordion_euro.addEventListener("click", (e) => {
        const activePanel_euro = e.target.closest(".accordion-panel_euro");
        if (!activePanel_euro) return;
        toggleAccordion(activePanel_euro);
    });

    function toggleAccordion_euro(panelToActivate_euro) {
        const buttons_euro =
            panelToActivate_euro.parentElement.querySelectorAll("button_euro");
        const contents_euro =
            panelToActivate_euro.parentElement.querySelectorAll(
                ".accordion-content_euro"
            );

        buttons_euro.forEach((button) => {
            button_euro.setAttribute("aria-expanded", false);
        });

        contents_euro.forEach((content) => {
            content_euro.setAttribute("aria-hidden", true);
        });

        panelToActivate_euro
            .querySelector("button")
            .setAttribute("aria-expanded", true);

        panelToActivate_euro
            .querySelector(".accordion-content_euro")
            .setAttribute("aria-hidden", false);
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".event_container");
    const leftButton = document.querySelector(".chevron-left");
    const rightButton = document.querySelector(".chevron-right");

    const updateButtonStates = () => {
        // Disable left button if scrolled all the way to the left
        if (container.scrollLeft <= 0) {
            leftButton.disabled = true;
            leftButton.classList.add("disabled");
        } else {
            leftButton.disabled = false;
            leftButton.classList.remove("disabled");
        }

        // Disable right button if scrolled all the way to the right
        if (
            container.scrollLeft + container.clientWidth >=
            container.scrollWidth
        ) {
            rightButton.disabled = true;
            rightButton.classList.add("disabled");
        } else {
            rightButton.disabled = false;
            rightButton.classList.remove("disabled");
        }
    };

    // Scroll the container and update button states
    const scrollContainer = (direction) => {
        const scrollAmount = 140; // Adjust this value for how far the container scrolls
        container.scrollBy({
            left: direction === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        });
    };

    // Add event listeners to the buttons
    leftButton.addEventListener("click", () => scrollContainer("left"));
    rightButton.addEventListener("click", () => scrollContainer("right"));

    // Update button states initially and on scroll
    container.addEventListener("scroll", updateButtonStates);
    window.addEventListener("resize", updateButtonStates); // Update on resize

    updateButtonStates(); // Initial state update when the page loads
});

// Popup
document.addEventListener("DOMContentLoaded", function () {
    // Select all the event buttons and all the popup containers
    const eventButtons = document.querySelectorAll(".eventbutton");
    const popups = document.querySelectorAll(".popup_container");

    // Loop over all event buttons
    eventButtons.forEach((button) => {
        // Add an event listener to each event button
        button.addEventListener("click", function () {
            // Get the corresponding popup by using the button's id
            const popupId = button.id.replace("popup", "popup_container");
            const popup = document.getElementById(popupId);

            // Toggle the 'active' class on the corresponding popup
            popup.classList.toggle("active");
        });
    });

    // Close the popup if clicking outside the popup card or event button
    document.body.addEventListener("click", function (event) {
        popups.forEach((popup) => {
            const popupCard = popup.querySelector(".popup_card");

            // If clicked outside both the popup card and the event button, close the popup
            if (
                !popupCard.contains(event.target) && // Clicked outside the popup card
                !event.target.matches(".eventbutton") // Clicked outside the event button
            ) {
                popup.classList.remove("active");
            }
        });
    });

