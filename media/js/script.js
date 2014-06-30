var legacy_class = function() {
	// Stores the cached elements
	this._$ = {};
	// Retreives (or stores, and then retreives) stored, cached jQuery objects.
	// Use this for repitious selectors when the contents are not expected to change
	this.$ = function(selector) {
		if (typeof selector == 'object' && selector != window) {
			window.log('Warning: Using legacy_class.$() on an object is not recommended.');
		}
		if (!this._$[ selector ]) {
			this._$[ selector ] = $( selector );
		}
		return this._$[ selector ];
	};

	/* VP stand for Viewport */
	this.currentVP = false;
	this.getVP = function() { 
	    // IE7 &8 are always VP 945
	    if (this.ie7or8()) {
	        return 945;
	    } else {   
	    
    		width = this.$(window).width();
    		if (width >= 945) {
    			return 945;
    		} else if (width >= 708 && width <= 944) {
    			return 708;
    		} else if (width >= 453 && width <= 707) {
    			return 453;
    		} else {
    			return 248;
    		}  
    	}
	};
	this.vp945 = function() {
		return (this.getVP() == 945);
	};
	this.vp708 = function() {
		width = this.$(window).width();
		return (this.getVP() == 708);
	};
	this.vp453 = function() {
		width = this.$(window).width();
		return (this.getVP() == 453);
	};
	this.vp248 = function() {
		width = this.$(window).width();
		return (this.getVP() == 248);
	};

	/* ALiases */
	this.ie7 = function() {
		return ($.browser.msie && Number($.browser.version) <= 7);
	}; 
	this.ie7or8 = function() {
		return ($.browser.msie && Number($.browser.version) <= 8);
	}; 
};

var lh = new legacy_class();

var googleMapsDeferred = $.Deferred();
function googleMapsInitialize() {
    googleMapsDeferred.resolve();
}

$(window).on('load', function () {
    if (lh.$('#map_canvas').size() > 0) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&amp;callback=googleMapsInitialize";
        document.body.appendChild(script);
    }
});

$(document).ready(function () {
    var $storyContainer = $('.storyWrap');
    if ($storyContainer.length > 0) {
        // Masonry layout
        $storyContainer.imagesLoaded(function () {
            $storyContainer.masonry({
                itemSelector: '.story',
                gutterWidth: 15
            });
            // Update "more" link text
            $storyContainer.find('.podcast .more').html('Listen to Podcast &raquo;');
            $storyContainer.find('.video .more').html('Watch Video &raquo;');
        });
    } // END Patient Story code

    //Hide media module and extend article when no modules inserted
    if (lh.$(".mediaWrap.columns .mediaModule").children().length == 0)
    {
        lh.$(".introContent").addClass("fullwidth");
        lh.$(".mediaWrap").addClass("hidden");
    }

    //provider page show/hide
    if (lh.$(".providerBio .publications li").length > 3) {
        // on load, show only 3 publications   
        $(".providerBio .publications li:gt(2)").addClass("hidden");
        $toggles = $('<li class="toggle more">Show More</li><li class="toggle less hidden">Show Less</li>');
        $(".providerBio .publications").on('click', '.more', function () {
            $(".providerBio .publications .hidden").removeClass("hidden");
            $(this).addClass("hidden");
        });
        $(".providerBio .publications").on('click', '.less', function () {
            $(".providerBio .publications li:gt(2)").addClass("hidden");
            $(this).addClass("hidden");
            $(".providerBio .publications .more").removeClass("hidden");
        });
        $(".providerBio .publications").append($toggles);
    }

    //Simple Modal
    $('.openModal').click(function (e) {
        e.preventDefault;
        var id = $(this).attr('data-item');
        $('.' + id).modal({
            overlayClose: true,
            position: [20, 0],
            opacity: 100,
            closeClass: 'simplemodal-close',
            overlayCss: {"background-color": "#fff"}
        });
    });

    //$('.fitToSize').attr('width', ($(window).width()/100)*40);
    //$('.fitToSize').attr('height', ($(window).height() / 100) * 40);


    lh.currentVP = lh.getVP();
    //window.log( lh.currentVP ); 

    lh.megaMenuTimer = false;
    lh.megaMenuMouseInSub = false;

    /*	Triggers an event only when the viewport is changed from one size to another
    as opposed to simply listening for the window to resize */
    lh.$(window).debounce('resize', function () {
        viewport_width = lh.getVP();

        if (viewport_width != lh.currentVP) {
            lh.currentVP = viewport_width;
            lh.$(window).trigger('viewport_change.lh').trigger('viewport_change_' + viewport_width + '.lh');
            window.log('viewport_change_' + viewport_width + '.lh');
            lh.megaMenuSmallClose();
        }
    });

    /**********************************************************/
    /*							 BEGIN - HEADER NAVIGATION								*/
    /**********************************************************/
    /* small breakpoint nav goes here */

    /// call to close menus
    lh.megaMenuSmallClose = function () {
        lh.$("#menuButtons .inner").removeClass("openedResBtn").addClass("closed");
        lh.$('#headerMenus').removeClass('explicitlyOpened');
        lh.$("#megaMenuSmallVP").hide();
        lh.$("#quickLinksSmallVP").hide();
        // reset more links
        lh.$("#headerMenus .moreLink").show();
        lh.$("#headerMenus .postMore, #headerMenus .lessLink").hide();
        lh.$("#megaMenuSiteFade").addClass("hidden");
    }


    /* set up content for main menu (used for smaller 2 viewports) */
    var $megaMenuSmallVP = $('<ul id="megaMenuSmallVP"></ul>');
    var $megaMenuMoreLink = $('<li class="moreLink moreLessToggle">See More +</li>');
    var $megaMenuLessLink = $('<li class="lessLink moreLessToggle">- See Less</li>');
    // loop through main site menu
    lh.$("#megaMenu li").each(function (index, menuElem) {
        $menuElem = $(menuElem);
        $megaMenuSmallItem = $('<li></li>');
        // top level nav item
        $menuElem.children("a:first").clone().appendTo($megaMenuSmallItem);
        // subnav 
        $mmTmpUL = $('<ul></ul>');
        $("#" + $menuElem.attr("data-sub-mega-menu-id")).find("ul.secondary").each(function (index) {
            // add more link  after 3rd item (before index 3)
            if (index == 3) {
                $megaMenuMoreLink.clone().appendTo($mmTmpUL);
            }

            $mmTmpLI = $(this).children("li.secondary").clone();
            // add class to items after the more link
            if (index > 2) {
                $mmTmpLI.addClass("postMore");
            }
            $mmTmpLI.appendTo($mmTmpUL);

        });
        // add less link
        $megaMenuLessLink.clone().appendTo($mmTmpUL);
        // add submenu links to main list
        $megaMenuSmallItem.append($mmTmpUL);
        $megaMenuSmallVP.append($megaMenuSmallItem);
    });
    // add new menu to dom
    lh.$("#headerMenus .w12").append($megaMenuSmallVP);

    // set up quick links 
    // this could be done via css if time allows
    var $quickLinksSmallEP = $('<ul id="quickLinksSmallVP"></ul>');
    // loop through quicklinks menu
    lh.$("#quickLinks ul.secondary>li").each(function () {
        $(this).clone().appendTo($quickLinksSmallEP);
    });
    // add new menu to dom
    lh.$("#headerMenus .w12").append($quickLinksSmallEP);

    /* add overlays to hide box shadow between tab & menu */
    lh.$("#menuButtons>div.closedResBtn").each(function () {
        $(this).append('<span class="overlay"></span>');
    });

    /* open menu */
    lh.$('#menuButtons').on('click', ".closedResBtn", function () {
        if (lh.currentVP <= 453) {
            lh.megaMenuSmallClose();
            $(this).addClass("openedResBtn");
            lh.$('#headerMenus').addClass('explicitlyOpened');
            switch ($(this).attr('id')) {
                case "menuButton":
                    lh.$("#megaMenuSmallVP").show();
                    break;

                case "quickLinksButton":
                    lh.$("#quickLinksSmallVP").show();
                    break;
            }
            lh.megaMenuFadeSite();
        }
    });

    /* see more links (small vps only) */
    lh.$("#headerMenus").on("click", ".moreLink", function () {
        $(this).siblings(".postMore").show();
        $(this).siblings(".lessLink").show();
        $(this).hide();
    });

    /* see less links (small vps only) */
    lh.$("#headerMenus").on("click", ".lessLink", function () {
        $(this).siblings(".postMore").hide();
        $(this).siblings(".moreLink").show();
        $(this).hide();
    });

    /* close menu */
    lh.$('#menuButtons').on('click', ".openedResBtn", function () {
        if (lh.currentVP <= 453) {
            lh.megaMenuSmallClose();
        }
    });


    // click the overlay to close menu  
    lh.$("#megaMenuSiteFade").on("click", function () {
        if (lh.currentVP <= 453) {
            lh.megaMenuSmallClose();
        } else {
            lh.subMegaMenusClose();
        }
    });

    /* closing the mega menu */
    lh.megaMenuTimerSet = function () {
        lh.megaMenuTimer = window.setTimeout(
        function () {
            if (!lh.megaMenuMouseInSub) {
                lh.subMegaMenusClose();
            }
        },
        150
      );
    }

    lh.$('#megaMenu').on('mouseleave', 'li', function (event) {
        if (!$.browser.msie || ($.browser.msie && $.browser.version >= 9)) {
            // The event isn't stored as a "mouseenter" event but rather a "mouseover" event inside jQuery
            lh.$('#megaMenu').stopDelayed('mouseenter mouseover');
        }

        lh.megaMenuTimerSet();
    });


    lh.$('#subMegaMenus').mouseenter(function () {
        lh.megaMenuMouseInSub = true;
        window.clearTimeout(lh.megaMenuTimer);
    });

    lh.$('#subMegaMenus').mouseleave(function () {
        lh.megaMenuMouseInSub = false;
        lh.megaMenuTimerSet();
    });

    lh.megaMenuOpen = function (event) {
        window.clearTimeout(lh.megaMenuTimer);
        lh.subMegaMenusClose();

        // hide quick links menu, if open
        lh.$("#quickLinks .toggle").removeClass("toggleOn").children(".secondary").hide();
        $this = $(this);

        // IE7 clicks 2 <li> at once
        if (lh.ie7) {
            event.stopPropagation();
        }

        // Opening
        if (!$this.hasClass('open')) {

            lh.$('body>header').addClass('secondaryIsOpen');

            // Hide all subMegaMenus 
            lh.$('#subMegaMenus').show().find('.subMegaMenu').hide();

            // Show only the specific subMegaMenu 
            $subMegaMenu = lh.$('#' + $this.data('sub-mega-menu-id'));
            $subMegaMenu.show();

            // Mark as opened
            lh.$('#megaMenu').find('li').removeClass('open');
            $this.addClass('open');


            // 5 col menus go full width 
            $('#subMegaMenus').removeClass("w12 manageWidth");
            if (($subMegaMenu.find(".subMegaMenuColumn").length > 4) && (lh.currentVP > 708)) {
                $('#subMegaMenus').addClass("w12");
            } else if (($subMegaMenu.find(".subMegaMenuColumn").length >= 4) && (lh.currentVP == 708)) {
                // at this VP - 4 or 5 cols wrap after 3 cols & do not go full width
                $('#subMegaMenus').addClass("manageWidth");
            }

            // Position Menu 
            var menuItemOffset = $this.offset();
            // Reset left offset to allow menu columns to flow/wrap naturally
            $('#subMegaMenus').offset({ left: 0 });
            // determine offset of menu 
            $('#subMegaMenus').offset(function () {
                // top does not change
                var menuOffset = $(this).offset();
                // Reset to the natural width before measuring
                var menuWidth = parseInt($(this).css('width', '').outerWidth());

                if (lh.currentVP == 708) {
                    if (menuWidth > 708) {
                        $(this).css('width', '708px');
                        menuWidth = 708;
                    }

                    // Column width fix
                    if ($subMegaMenu.outerWidth() > 708) {
                        $subMegaMenuSecondaries = $subMegaMenu.find('.subMegaMenuColumn ul.secondary');
                        $subMegaMenuSecondaries.css('width', Math.floor(708 / Number($subMegaMenuSecondaries.size())) + 'px');
                    }
                } else {
                    // Reset any changes that were made while we were at VP 708
                    $subMegaMenu.css('width', '');
                    $subMegaMenu.find('.subMegaMenuColumn ul.secondary').css('width', '');
                }

                // left responds to position of nav item & width of menu (don't want to go off screen)
                menuOffset.left = parseInt(menuItemOffset.left);
                var boundaryLeft = parseInt($("#headerTop").offset().left);
                var boundaryRight = parseInt($("#headerTop").width()) + boundaryLeft;

                if ((menuOffset.left + menuWidth) > boundaryRight) {
                    menuOffset.left = boundaryRight - menuWidth;
                }

                return menuOffset;  // returned value is the the offset
            });


            // normalize column heights
            // may have to be limited to 2 largest viewpoints 
            var tallColAr = new Array();
            $subMegaMenu.find(".subMegaMenuColumn").each(function () {
                var curTopOffset = $(this).offset().top;
                var thisHeight = $(this).height();
                if (curTopOffset > tallColAr[curTopOffset]) {
                    tallColAr[curTopOffset] = thisHeight;
                } else if (thisHeight > tallColAr[curTopOffset]) {
                    tallColAr[curTopOffset] = thisHeight
                }
            });
            $subMegaMenu.find(".subMegaMenuColumn").height(tallColAr[$(this).offset().top]);
            // Reset the See More + buttons (functionality temporarily disabled)
            // lh.$('#subMegaMenus').trigger('resetSeeMore.lh'); 

            // resize shadow & overlap to prevent FF bug.
            // 100% width (which works fine for other browsers) sets these at 945px in FF, pushing the layout out & causing scrollbars 
            // there is probably a better css solution if time permits 
            if ($this.children(".shadow").width() > $this.width()) {
                $this.children(".shadow, .overlap").width($this.width());
            }

            // fadeout site behind header 
            lh.megaMenuFadeSite();

            // Trigger the click event on the MENU button in case there is an orientation change
            if (!lh.$('#menuButton').hasClass('open')) {
                lh.$('#menuButton').trigger('click');
            }

            // Closing
        } else {
            lh.subMegaMenusClose();
        }
    };

    /* trigger event fo the primary level of the mega menu (all viewport sizes) */
    if ($.browser.msie && $.browser.version <= 8) {
        lh.$('#megaMenu').on('mouseenter', 'li', lh.megaMenuOpen);
    } else {
        lh.$('#megaMenu').delayed('mouseenter', { delay: 150, preventDefault: true }, 'li', lh.megaMenuOpen);
    }


    lh.megaMenuFadeSite = function () {
        var headerHeight = lh.$("header").height();
        var docHeightMinusHeader = $(document).height() - headerHeight;
        $("#megaMenuSiteFade").removeClass("hidden").css('top', headerHeight + "px").height(docHeightMinusHeader);
    }


    // call this to close mega menu
    lh.subMegaMenusClose = function () {
        lh.$('#megaMenu').find('li').removeClass('open');
        lh.$('body>header').removeClass('secondaryIsOpen');
        lh.$('#subMegaMenus').hide();
        lh.$('#menuButton').removeClass('open');
        lh.$("#megaMenuSiteFade").addClass("hidden");
    }

    // allow top level links to click through
    lh.$("#megaMenu").on("click", "li", function () {
        window.location = $(this).children("a").attr("href");
    });

    /* to do: remove???? */

    /* Click event for the secondary, tertiary, and quaternary mega menu links (vp453 and vp248 only) */
    lh.$('#subMegaMenus').on('click', 'ul li a', function (event) {
        // Only in mobile views
        if (lh.vp453() || lh.vp248()) {
            $li = $(this).parents('li').first();

            // If this <li> has a child <ul>
            if ($li.find('ul').size() > 0) {
                // Prevent the link from changing the page and open the tertiary menu.
                event.preventDefault();

                // When expanding...
                if (!$li.hasClass('open')) {
                    // Secondary > Tertiary
                    if ($li.hasClass('secondary')) {
                        lh.$('body>header').removeClass('secondaryIsOpen').addClass('tertiaryIsOpen');

                        // Tertiary > Quaternary
                    } else if ($li.hasClass('tertiary')) {
                        lh.$('body>header').removeClass('secondaryIsOpen tertiaryIsOpen').addClass('quaternaryIsOpen');
                    }

                    // Mark as opened
                    $li.addClass('open');

                    // When colapsing...
                } else {
                    // Tertiary > Secondary
                    if ($li.hasClass('secondary')) {
                        lh.$('body>header').removeClass('tertiaryIsOpen quaternaryIsOpen').addClass('secondaryIsOpen');

                        // Quaternary > Tertiary
                    } else if ($li.hasClass('tertiary')) {
                        lh.$('body>header').removeClass('quaternaryIsOpen').addClass('tertiaryIsOpen');
                    }

                    // Close all children
                    $li.find('li.open').removeClass('open');

                    // CLose this
                    $li.removeClass('open');
                }

                $li.find('ul li').css('display', '');
            }
        }
    });

    // Reusable event listener for closing all open menus
    lh.$('#subMegaMenus').on('closeAll.lh', function () {
        $this = $(this);

        // Close anything open
        $this.find('.open').removeClass('open');
    });

    // Reusable event listener for resetting the See More + buttons
    lh.$('#subMegaMenus').on('resetSeeMore.lh', function () {
        $this = $(this);

        // Hide everything but the first 3 tertiary items
        // Only matters on vp945 and vp708 but done all of the time in case there is an orientation change
        $this.find('.subMegaMenu .subMegaMenuColumn ul.tertiary').each(function () {
            // commenting out for now - we may reinstate this functionality later
            //$(this).find('li:gt(4)').hide();
        });

        // Show the See More + buttons
        $this.find('.subMegaMenu li.subMegaMenuExpand').show();
    });

    /* Click event for the See More+ buttons (vp945 and vp 708 only) */
    lh.$('#subMegaMenus').on('click', '.subMegaMenuExpand', function () {
        $(this).hide().parents('ul').first().find('li').show();
    });

    /* Event listener to reset (colapse) the tertiary navigation lists after an orientation change */
    lh.$(window).on('viewport_change_945.lh viewport_change_708.lh', function () {
        lh.$('#subMegaMenus').trigger('resetSeeMore.lh');
    });


    // quicklinks open (desktop)
    lh.$(".no-touch #quickLinks .toggle").mouseenter(function () {
        $(this).addClass("toggleOn").children(".secondary").show();
        lh.subMegaMenusClose();
    });
    // quicklinks close (desktop)                                    
    lh.$(".no-touch #quickLinks .toggle").mouseleave(function () {
        $(this).removeClass("toggleOn").children(".secondary").hide();
    });
    // quicklinks open/close  with clicks (touch)
    lh.$(".touch #quickLinks .toggle").click(function () {
        if ($(this).hasClass("toggleOn")) {
            $(this).removeClass("toggleOn").children(".secondary").hide();
        } else {
            $(this).addClass("toggleOn").children(".secondary").show();
            lh.subMegaMenusClose();
        }
    });



    /**********************************************************/
    /*								END - HEADER NAVIGATION								 */
    /**********************************************************/


    // Header search
    lh.$('#headerTop .headerSearchInput')
        .on('focus', function () {
            var $this = $(this);
            if ($this.val().trim() == $this.data('default-value')) {
                $(this).removeClass('default').val('');
            }
        })
        .on('blur', function () {
            var $this = $(this);
            if ($this.val().trim() == '' || $this.val().trim() == $this.data('default-value')) {
                $(this).addClass('default').val($this.data('default-value'));
            }
        })
        .trigger('blur');

    lh.$('#headerTop .headerSearchSubmit').on('click', function (e) {
        var q = lh.$('#headerTop .headerSearchInput').val().trim();
        if (q == '' || q == lh.$('#headerTop .headerSearchInput').data('default-value')) {
            e.preventDefault();
            lh.$('#headerTop .headerSearchInput').focus();
            return false;
        }
    });



    // template js
    $(".addThis").click(function (event) {
        event.preventDefault();
        return addthis_open(this, '', '[URL]', '[TITLE]');
    });


    // footer email signup        
    $('#pageFooter .emailSignup').val($('#pageFooter .emailSignup').attr('data-label'));
    $('.emailSignup').on('focus', function () {

        $this = $(this);
        if ($this.val() == $this.attr('data-label')) {
            $this.val('');
        }
    });
    $('.emailSignup').on('blur', function () {
        $this = $(this);
        if ($this.val() == '') {
            $this.val($this.attr('data-label'));
        }
    });


    // table striping for older IEs 
    $("table.tableGrid").each(function () {
        $(this).find("tr:even").addClass("even");
    });

    /*  ** Home Page *** */
    // home page banner links
    $(".hpBannerRow").on("click", ".bannerBlock", function () {
        if ($(this).attr("data-cta-link")) {
            window.location = $(this).attr("data-cta-link");
        }
    });

    // home page banner rotation should pause when the mouse is over the controls
    // but not on touch devices, because that mouseout event never triggers & the rotation never resumes
    if (lh.$(".hpBannerRow").length > 0) {
        lh.pauseHPBC = true;
        if (Modernizr.touch) {
            lh.pauseHPBC = false;
        }
    }
    // init home page banner rotator     
    $(".hpBannerRow .rotateBannerWrap").responsiveSlides({
        auto: true,             // Boolean: Animate automatically, true or false
        speed: 1000,            // Integer: Speed of the transition, in milliseconds
        timeout: 5250,          // Integer: Time between slide transitions, in milliseconds
        pager: true,           // Boolean: Show pager, true or false
        nav: false,             // Boolean: Show navigation, true or false
        random: false,          // Boolean: Randomize the order of the slides, true or false
        pause: true,           // Boolean: Pause on hover, true or false
        pauseControls: lh.pauseHPBC,   // Boolean: Pause when hovering controls, true or false
        prevText: "Previous",   // String: Text for the "previous" button
        nextText: "Next",       // String: Text for the "next" button
        maxwidth: "",           // Integer: Max-width of the slideshow, in pixels
        controls: "",           // Selector: Where controls should be appended to, default is after the 'ul'
        namespace: "rslides",   // String: change the default namespace used
        before: function () { $(".lt-ie9 .hpBannerRow .bannerBlock .bannerText").hide(); },   // Function: Before callback
        after: function () { $(".lt-ie9 .hpBannerRow .bannerBlock .bannerText").show(); }     // Function: After callback
    });


    $(".rslides").responsiveSlides({
        auto: false, 		// Boolean: Animate automatically, true or false
        speed: 1000, 		// Integer: Speed of the transition, in milliseconds
        timeout: 4000, 		// Integer: Time between slide transitions, in milliseconds
        pager: false, 		// Boolean: Show pager, true or false
        nav: true, 			// Boolean: Show navigation, true or false
        random: false, 		// Boolean: Randomize the order of the slides, true or false
        pause: false, 		// Boolean: Pause on hover, true or false
        pauseControls: false, // Boolean: Pause when hovering controls, true or false
        prevText: "Previous", // String: Text for the "previous" button
        nextText: "Next", 	// String: Text for the "next" button
        maxwidth: "", 		// Integer: Max-width of the slideshow, in pixels
        controls: ".sliderNav", // Selector: Where controls should be appended to, default is after the 'ul'
        namespace: "rslides", // String: change the default namespace used
        //after: function(){alert($(".rslides .rslides1_on").index());},	 // Function: After callback
        after: function () {
            var slidePosition = $(".rslides .rslides1_on").index() + 1;
            $(".sliderPosition").html(slidePosition);
        }
    });

    // append slide total number into correct spot
    var totalSlides = $(".rslides li").length;
    $(".sliderTotal").html(totalSlides);
    $(".sliderStatus").show();

    $(".rslides2").responsiveSlides({
        auto: false, 		// Boolean: Animate automatically, true or false
        speed: 1000, 		// Integer: Speed of the transition, in milliseconds
        timeout: 4000, 		// Integer: Time between slide transitions, in milliseconds
        pager: false, 		// Boolean: Show pager, true or false
        nav: true, 			// Boolean: Show navigation, true or false
        random: false, 		// Boolean: Randomize the order of the slides, true or false
        pause: false, 		// Boolean: Pause on hover, true or false
        pauseControls: false, // Boolean: Pause when hovering controls, true or false
        prevText: "Previous", // String: Text for the "previous" button
        nextText: "Next", 	// String: Text for the "next" button
        maxwidth: "", 		// Integer: Max-width of the slideshow, in pixels
        controls: ".slider2Nav", // Selector: Where controls should be appended to, default is after the 'ul'
        namespace: "rslides2", // String: change the default namespace used
        //after: function(){alert($(".rslides .rslides1_on").index());},	 // Function: After callback
        after: function () {
            var slidePosition = $(".rslides2 .rslides1_on").index() + 1;
            $(".slider2Position").html(slidePosition);
        }
    });

    // append slide total number into correct spot
    var totalSlides = $(".rslides2 li").length;
    $(".slider2Total").html(totalSlides);
    $(".slider2Status").show();

    $(".rslides3").responsiveSlides({
        auto: false, 		// Boolean: Animate automatically, true or false
        speed: 1000, 		// Integer: Speed of the transition, in milliseconds
        timeout: 4000, 		// Integer: Time between slide transitions, in milliseconds
        pager: false, 		// Boolean: Show pager, true or false
        nav: true, 			// Boolean: Show navigation, true or false
        random: false, 		// Boolean: Randomize the order of the slides, true or false
        pause: false, 		// Boolean: Pause on hover, true or false
        pauseControls: false, // Boolean: Pause when hovering controls, true or false
        prevText: "Previous", // String: Text for the "previous" button
        nextText: "Next", 	// String: Text for the "next" button
        maxwidth: "", 		// Integer: Max-width of the slideshow, in pixels
        controls: ".slider3Nav", // Selector: Where controls should be appended to, default is after the 'ul'
        namespace: "rslides3", // String: change the default namespace used
        //after: function(){alert($(".rslides .rslides1_on").index());},	 // Function: After callback
        after: function () {
            var slidePosition = $(".rslides3 .rslides1_on").index() + 1;
            $(".slider3Position").html(slidePosition);
        }
    });

    // append slide total number into correct spot
    var totalSlides = $(".rslides3 li").length;
    $(".slider3Total").html(totalSlides);
    $(".slider3Status").show();

    // Patient Stories banner links
    $(".ipPatientStories").on("click", ".bannerBlock", function () {
        if ($(this).attr("data-cta-link")) {
            window.location = $(this).attr("data-cta-link");
        }
    });

    // Patient Stories banner rotation should pause when the mouse is over the controls
    // but not on touch devices, because that mouseout event never triggers & the rotation never resumes
    if (lh.$(".Patient Stories").length > 0) {
        lh.pausePSBC = true;
        if (Modernizr.touch) {
            lh.pausePSBC = false;
        }
    }
    $(".ipPatientStories .rotateBannerWrap").responsiveSlides({
        auto: false,             // Boolean: Animate automatically, true or false
        speed: 1000,            // Integer: Speed of the transition, in milliseconds
        timeout: 5250,          // Integer: Time between slide transitions, in milliseconds
        pager: true,           // Boolean: Show pager, true or false
        nav: false,             // Boolean: Show navigation, true or false
        random: false,          // Boolean: Randomize the order of the slides, true or false
        pause: true,           // Boolean: Pause on hover, true or false
        pauseControls: lh.pausePSBC,   // Boolean: Pause when hovering controls, true or false
        prevText: "Previous",   // String: Text for the "previous" button
        nextText: "Next",       // String: Text for the "next" button
        maxwidth: "",           // Integer: Max-width of the slideshow, in pixels
        controls: "",           // Selector: Where controls should be appended to, default is after the 'ul'
        namespace: "rslides",   // String: change the default namespace used
        before: function () { $(".lt-ie9 .ipPatientStories .bannerBlock .bannerText").hide(); },   // Function: Before callback
        after: function () { $(".lt-ie9 .ipPatientStories .bannerBlock .bannerText").show(); }     // Function: After callback
    });

    /**
    * A-Z Search screen
    */

    //
    // Separate letter search buttons on two lines
    //Prevent click action when a disabled letter search link is clicked
    //
    var letterSearch = $('ol.letterSearch');
    if (letterSearch.size() > 0) {
        $('ol.letterSearch').css('max-width', function () {
            var total_width = 0;

            $(this).find('li').each(function () {
                total_width += $(this).outerWidth(true);
            });

            return Math.floor(total_width / 2) + 8;
        });

        $('.inactive a').click(function (ev) {
            ev.preventDefault();
        });
    }


    //
    // Split list  into two columns
    //
    var alphaList = $('ol.alphaList');
    if (alphaList.size() > 0) {
        var items = alphaList.children('li');
        var firstColumnSize = Math.ceil(items.size() / 2);
        var firstColumnItems = items.slice(0, firstColumnSize);
        var secondColumnItems = items.slice(firstColumnSize);

        function createAlphaList(items) {
            var list = $(document.createElement('ol'));
            list.addClass('alphaList');
            list.addClass('clearFix');
            list.append(items);
            return list;
        }

        var leftCol = createAlphaList(firstColumnItems);
        var rightCol = createAlphaList(secondColumnItems);

        leftCol.insertAfter(alphaList);
        rightCol.insertAfter(leftCol);
        alphaList.remove();
    }

    /**
    * END A-Z Search screen
    */

    /**
    * Generic Search
    */

    // Add prompt text to test table keyword form
    var searchField = $('.search_form .search_field');

    searchField.val(function () {
        var $this = $(this);
        return $this.attr('data-label') || $this.val();
    });

    searchField.on('focus', function () {
        var $this = $(this);

        if ($this.val() == $this.attr('data-label')) {
            $this.val('');
        }
        $this.addClass('has_focus');
    });
    searchField.on('blur', function () {
        var $this = $(this);
        if ($this.val() == '') {
            $this.val($this.attr('data-label'));
            $this.removeClass('has_focus');
        } else {
            $this.addClass('has_focus');
        }
    });


    /* Resize  */
    /*
    var styledSel = $('.select_container');
    if (styledSel.size() > 0) {
        
    var resizeFunc = function() {
    styledSel.each(function () {
    var $this = $(this);
    $this.width($this.parent().width() - 26);
                
    $this.find('select').width($this.width() + 26);
    });
    };
        
    // Call initially
    resizeFunc();
    
    // call when window resizes
    $(window).resize(resizeFunc);
    }
    */
    /*
    $('.test_table select').on('change', function(){
    $this = $(this);
    if ($this.val() != '') {
    $this.parents('form').submit();
    }
    });
    */

    $('.search_form select').on('focusin', function () {
        $(this).addClass('has_focus');
    });

    $('.search_form select').on('focusout', function () {
        $this = $(this);
        if ($this.val() == '') {
            $this.removeClass('has_focus');
        } else {
            $this.addClass('has_focus');
        }
    });

    /**
    * END Generic Search
    */

    // Location Map 
    if ((lh.$(".locationList").length == 1) && (lh.$("#map_canvas").size() == 1) && (lh.$(".locationMap").length == 1)) {
        googleMapsDeferred.done(function () {
            lhsLoc.makeMap();
            lhsLoc.resetMap();
            lh.$(".locationMap .menuWrap select").on("change", lhsLoc.filterMap);
        });
    }

    // Contact form
    if ($('.contact_us').size() > 0) {

        var validateFunction = function () {
            var $this = $(this);
            var type = $this.attr('data-required');
            var isValid = true;

            if (type === 'present') {
                isValid = $this.val().length > 0;

            } else if (type === 'email') {
                var regex = /^[\w\d\._%-]+@[\w\d\._-]+\.\w{2,4}$/;
                isValid = regex.exec($this.val()) !== null;

            }

            if (isValid) {
                $this.siblings('label').removeClass('invalid');
            } else {
                $this.siblings('label').addClass('invalid');
            }

            return isValid;
        };

        $('input[data-required], textarea[data-required]').on('blur', validateFunction);
        $('select[data-required]').on('focusout', validateFunction).on('change', validateFunction);
        /*
        $('form.contact_us').submit(function(ev){
        var isValid = true;
        
        $('*[data-required]').each(function(){
        var validElement = validateFunction.call(this);
        isValid = isValid && validElement;
        });
            
        if (!isValid) {
        ev.preventDefault();
        var invalid = $('.invalid').get(0).scrollIntoView();
        }
        });
        */

        $('.contact_field .cancel').click(function (ev) {
            ev.preventDefault();
            var form = $(this).parents('form').get(0);
            if (form !== 'undefined') { form.reset(); }
        });

    }
    /*
    $('.blue_submit').click(function(){
    $(this).parents('form').submit();
    });
    */

    /*
    Campaign Page
    */
    if ($('.accordion').size() > 0) {
        $('.accordion h3').each(function (idx) {
            var mod = idx % 4;
            var cls;
            if (mod === 0) {
                cls = 'first';
            } else if (mod === 1) {
                cls = 'second';
            } else if (mod === 2) {
                cls = 'third';
            } else if (mod === 3) {
                cls = 'fourth';
            }

            $(this).addClass(cls);
        });

        $('.accordion h3 a').click(function (ev) {
            ev.preventDefault();

            var $this = $(this);
            var content = $this.parent().siblings('.accordionContent');
            var cls = 'open';

            if ($this.hasClass(cls)) {
                $this.removeClass(cls);
                content.slideUp(200);

            } else {
                _gaq.push(['_trackEvent', 'Tab', 'Clicked', $this.text()]);
                $this.addClass(cls);
                content.slideDown(200);

            }
        });
    }
    /* End Campaign Page */


    // provider bio page (functions below)  
    if (lh.$(".providerBio .locations ol>li").length >= 1) {
        googleMapsDeferred.done(function () {
            lh.gmaps.init();
        });
    }


    // PDF links
    lh.$('#pageContent').find('a').each(function () {
        var $this = $(this);

        href = $this.attr('href');
        if (typeof href != 'undefined') {
            href = href.toLowerCase().trim();
            
            if (href.indexOf('pdf/index.html') > 0 || href.indexOf('.pdf') > 0) {
                if ($this.find('img').size() == 0) {
                    if ($this.css('display') == 'inline') {
                        $this.addClass('pdfLink');
                        $this.attr("target", "_blank");
                    } else {
                        $this.attr('title', '(links to a PDF file)');
                    }
                }
            }
        }
    });

    //Inject onclick GA tracking event on PDF
    lh.$('.pdfLink').click( function() {
        var $this = $(this);
        href = $this.attr('href');
        _gaq.push(['_trackEvent', 'PDF', 'Download', href]);
        //dataLayer.push({'eventAction':'Download', 'eventCategory':'PDF', 'eventLabel':href});
    });

   //Inject onclick GA tracking event on Form Submit
    lh.$('.scfSubmitButtonBorder').click(function () {
        var $this = $(this);
        href = $(location).attr('href');
        _gaq.push(['_trackEvent', 'Form', 'Submit', href]);
    });

    //Inject onclick GA tracking event on schedule widgets
    lh.$('.schedule').click(function () {
        var $this = $(this);
        href = $(location).attr('href');
        _gaq.push(['_trackEvent', 'Scheduling', 'Click', href]);
    });

    //Inject onclick GA tracking event on donate widgets
    lh.$('.donateTout').click(function () {
        var $this = $(this);
        href = $(location).attr('href');
        _gaq.push(['_trackEvent', 'Donate', 'Click', href]);
    });

    if ($('.surveyPopup').size() > 0) {
        //Show Survey popup
        if ($.cookie('survey_popup') != 'hide') {
            $('.surveyPopup').show();
        }
        //Hide Survey with cookie if hidden
        $('.closeicon').click(function () {
            $('.surveyPopup').hide();
            $.cookie('survey_popup', 'hide', { expires: 3 });
        });
    }


    
});


/* END doc ready  *****************************/

/**** Location MAP *****************/ 
var lhsLoc = {}; // namespacing 
lhsLoc.infoWinAr = [];    

// make the map
// default is centered on PDX with no markers
lhsLoc.makeMap = function(){
	var center =  new google.maps.LatLng(45.511795, -122.675629);
	var opts = {
      zoom: 12,
	  maxZoom: 14,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	lhsLoc.map = new google.maps.Map(document.getElementById("map_canvas"), opts);
	lhsLoc.markerAr = []; // to hold the markers 
	lhsLoc.mapBounds = new google.maps.LatLngBounds(); // for the bounding box 

}

// mark locations on map 
// filter 1st to prevent unwanted locations from displaying
lhsLoc.markMap = function(index, el){ 
    var $el = $(el); 
    var mlat = $el.find(".locAddress").attr('data-location-latitude'); 
	var mlong = $el.find(".locAddress").attr('data-location-longitude');
	var mloc = new google.maps.LatLng(mlat, mlong); 
	var miconglyph = index+1;
	var micon =  "http://chart.googleapis.com/chart?chst=d_map_pin_letter_withshadow&chld=" + miconglyph + "|006699|FFFFFF"; 
	var locName = $el.find("h3:first").text();
	
	lhsLoc.markerAr[index] = new google.maps.Marker({
	      position: mloc, 
	      title: locName,
		  icon: micon
	});    
	// place marker
	lhsLoc.markerAr[index].setMap(lhsLoc.map); 
	// info window
	var contentStr = "";
	lhsLoc.infoWinAr[index] = new google.maps.InfoWindow({
		content: contentStr
	});
	google.maps.event.addListener(lhsLoc.markerAr[index], 'click', function(){  
		// close all windows
		for (i in lhsLoc.infoWinAr) {
			lhsLoc.infoWinAr[i].close();
		}  
		// poplate the window with the corresponding content 
		var mpopwin = '<div class="infoWin"><div class="name"><a href="' + $el.find("h3 a").attr("href") + '">' + locName + '</a></div><div class="address">' + $el.find(".locAddress").html() + "</div></div>"
		lhsLoc.infoWinAr[index].content = mpopwin; 
		// open the window at the marker
		lhsLoc.infoWinAr[index].open(lhsLoc.map, this)
	});
	// reset bounds (zoom & center) to include all points
	lhsLoc.mapBounds.extend(mloc);
	lhsLoc.map.fitBounds(lhsLoc.mapBounds);   
}	
/*************************************/
lhsLoc.filterMap = function(){
    // reset listing
    lh.$(".locationItemRow").removeClass("filtered"); 
    if ( $(this).find("option:selected").first().val() != "seeAll" ) {
        var filterOn = $(this).find("option:selected").first().text();
        // loop through & hide locations that don't provide the service
        lh.$(".locationItemRow").each(function(){  
            var matches = 0;
            $(this).find(".services li").each(function(){ 
                if ($.trim($(this).text()) == $.trim(filterOn)){
                    matches++;
                }
            }); 
            if (!matches) {
                $(this).addClass("filtered");
            }
        }); 
    }
    lhsLoc.resetMap();
} 


lhsLoc.resetMap = function(){ 
    lhsLoc.clearMarkers();
    $(".locationMap .locationList .locationItemRow").not('.filtered').each( lhsLoc.markMap );
}

// remove all markers
lhsLoc.clearMarkers = function() {
  if (lhsLoc.markerAr) {
    for (i in lhsLoc.markerAr) {
      lhsLoc.markerAr[i].setMap(null);
    }
  }
}
/**** END Location Map ********************************/   

/**** Provider Bio Map *******************************/
lh.gmaps = []; 
lh.alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

lh.gmaps.init = function(){
     
    lh.gmaps.map; 
    lh.gmaps.geocoder = new google.maps.Geocoder(); 
    lh.gmaps.mapBounds = new google.maps.LatLngBounds();
    
    // concatenate & format each address 
    lh.$(".locations ul.address").each(function(index, el){ 
        var addressStr = "";
        var lineCount = $(el).children("li").length;
        $(el).children("li").each(function(index, el){  
            addressStr += $.trim($(this).text());
            if (index+1 < lineCount) {
                addressStr += ", ";
            }
        });
        lh.gmaps.placeMarker(addressStr, index);
    });
    
    // draw map 
    var mapOptions = {
      center: new google.maps.LatLng(45.511795, -122.675629),
      zoom: 12, 
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    lh.gmaps.map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions); 
} 
// END lh.gmaps.init

lh.gmaps.placeMarker = function(addressStr, index){
    lh.gmaps.geocoder.geocode( { 'address': addressStr}, function(results, status) {  
      if (status == google.maps.GeocoderStatus.OK) { 
          lh.gmaps.map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              icon: "http://www.google.com/mapfiles/marker" + lh.alphabet[index] +".png",
              map: lh.gmaps.map,
              position: results[0].geometry.location
          });  
          // fit map to boundary of all markers
          lh.gmaps.mapBounds.extend(results[0].geometry.location);
          lh.gmaps.map.fitBounds(lh.gmaps.mapBounds);        
      } else {
          console.log("Geocode failed for index " + index + ": " + status);
      }
    });  
}
// END lh.gmaps.geocode
/* END Provider Bio Map functions *****************/



/**** Media Players ***********************************/



$(document).ready(function () {

    // Listen for a video row being clicked in secondary media module. 
    $('.video').each(function () {
        $this = $(this);
        var ytVideoID = $this.attr('data-video-id');
        if ($(window).width() < 482) {
            //go straight to youtube
            this.href = ytVideoID;
        }
    });

    // more/less functionality
    lh.$(".videoWrap ul").each(function (index, el) {
        $el = $(el);
        $lis = $el.children("li");
        // show after the 3rd if there are 4+ videos 
        $lis.show(); // hiding with css & showing now to prevent fouc
        if ($lis.length > 3) {
            $($lis[2]).after('<li class="more">Show More</li>');
            $el.children("li:last").after('<li class="less hidden">Show Less</li>');
            // hide subsequent lis
            $el.children("li:gt(2)").not(".more, .less").addClass("hidden moreMedia");
        }
    }); // end of adding more/less

    // wire up more 
    lh.$(".videoWrap ul").on("click", ".more", function () {
        $(this).siblings("li").removeClass("hidden");
        $(this).addClass("hidden");
    });

    // wire up less 
    lh.$(".videoWrap ul").on("click", ".less", function () {
        $(this).siblings("li.moreMedia").addClass("hidden");
        $(this).addClass("hidden");
        $(this).siblings("li.more").removeClass("hidden");
    });



    /*
    Loop through video media elements and give unique youtube containers (ids).
    Also get the thumbnails from Youtube and automatically insert.

    Then loop through the <li>s and set thumb and duration. 
    */
    if ($(".videoWrap ul li").length > 0) {
        var ytNumID = 1;
        // Loop through each wrapper.
        $('.videoWrap').each(function () {
            $this = $(this);
            // Insert an element with a unique ID so the youtube api can reference it.
            $('<div class="youTubePlayerHolder" id="ytVidPlayer' + ytNumID + '"></div>').appendTo($this.find('.posterHolder'));
            ytNumID = ytNumID + 1;

            // Get the variables from the first list item of this area to set poster and poster video id.
            var firstElement = $this.find('li:first-child');
            var videoPoster = firstElement.attr("data-video-poster");
            var videoID = firstElement.attr("data-video-id");

            // Some browsers will trigger the 404 page when loading a blank src
            if (typeof videoPoster == 'undefined' || videoPoster.length == 0) {
                videoPoster = 'media/img/blank.png';
            }

            // Set the Poster Image.
            $this.find('.posterHolder').append('<img class="mediaPoster" data-video-id="' + videoID + '" src="' + videoPoster + '" style="">');

            // Loop through each li in the wrappers to put in youtube thumbs. (except for more links)
            $this.find('li').not(".more, .less").each(function () {
                $this = $(this);
                var videoID = $this.attr("data-video-id");
                var videoThumb = $this.attr("data-video-thumb");
                var thisLi = $this;
                // Get the length of video via ajax
                $.getJSON("http://gdata.youtube.com/feeds/api/videos/" + videoID + "?v=2&alt=json&callback=?", function (data) {
                    var mediaPoster = thisLi.parents('ul').prev('.posterHolder').find('img.mediaPoster');
                    if (mediaPoster.attr('src') == '/media/img/blank.png' || mediaPoster.attr('src') == 'undefined' || mediaPoster.attr('src') == '') {
                        var videoPosterFallback = false;
                        if (typeof data.entry.media$group.media$thumbnail != 'undefined') {
                            for (i in data.entry.media$group.media$thumbnail) {
                                if (data.entry.media$group.media$thumbnail[i].yt$name == 'hqdefault') {
                                    videoPosterFallback = data.entry.media$group.media$thumbnail[i];
                                }
                            }

                            if (!videoPosterFallback && data.entry.media$group.media$thumbnail.length > 0) {
                                videoPosterFallback = data.entr.media$groupy.media$thumbnail[0];
                            }

                            if (videoPosterFallback) {
                                thisLi.attr('data-video-poster', videoPosterFallback.url);

                                if (mediaPoster.attr('data-video-id') == videoID) {
                                    mediaPoster.attr('src', videoPosterFallback.url).addClass('fromYouTube');
                                }
                            }
                        }
                    }

                    var length = getTime(data.entry.media$group.yt$duration.seconds);
                    // If there is a thumb for us to use, use it, else use yt thumb.
                    if (typeof videoThumb === 'undefined') {
                        var thumb = data.entry.media$group.media$thumbnail[0].url;
                    } else {
                        var thumb = videoThumb;
                    }
                    // Prepend the image.
                    thisLi.prepend('<img src="' + thumb + '" style="width:35px;height:20px;">');
                    // Append the duration.
                    thisLi.prepend('<span class="mediaTime">' + length + '</span>');
                });
            });
        });
    }

    // Only load the YouTube API if there are YouTube videos on the page
    if (lh.$('.mediaModule .youTubePlayerHolder').size() > 0) {
        // Initiate youtube player api asynchronously.
        var tag = document.createElement('script');
        tag.src = "http://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Legacy Photo Library AJAX
    $(document).scroll(function () {
        if (isScrolledIntoView('.goToTop')) {
            if ($('.hideAssetSection:first').length) {
                    $('.ajaxLoading').removeClass('hideSpinner');
                    setTimeout(function () {
                        $('.hideAssetSection:first').removeClass('hideAssetSection');
                        $('.ajaxLoading').addClass('hideSpinner');
                    }, 700);
                }
            }
    });

    //Scroll to top of Image Library
    $("a[href='#top']").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "fast");
        return false;
    });

    //Check if item is visible
    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

});  // end doc ready


//object to hold all players on the page
var players = {};

// Is only called if the YouTube API script file is loaded
function onYouTubeIframeAPIReady() {
    $('.mediaModule .youTubePlayerHolder').each(function(event) {  
        $this = $(this);
        var videoIDString = $this.parents().find('li:first-child').attr("data-video-id");
        var iframeID = $this.attr('id');
        //alert(iframeID);
        var posterImage = $this.next();
        var thisPlayer = $this;
        //players[iframeID] = new YT.Player(iframeID, {
        players[iframeID] = new YT.Player(iframeID, {
            videoId: videoIDString,
            height: '171',
            width: '304',
            playerVars: {
            controls: 1,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            theme: "light",
            wmode: "opaque"      
            },
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    });
    
    // Listen for a video row being clicked. 
    $('.mediaPoster').click(function() {
      $this = $(this);
      var ytVideoID = $this.attr('data-video-id');
      if ( $(window).width() < 944 ) {
        //go straight to youtube
        window.location = 'http://www.youtube.com/watch?v='+ytVideoID;
      } else {
        // Get the id of the video holder, change the video id and play.
        var ytPlayerEleID = $this.prev().attr('id');
        var posterHeight = $this.height();
        $this.hide();
        //$this.prev().css('position','static').show();
        //$(this).parent().fitVids();
        players[ytPlayerEleID].loadVideoById(ytVideoID);
      }
    });

    // Listen for a video row being clicked. 
    $('.videoRow').click(function() {
      // Get the yt video id from this li.
      var $this = $(this);
      var ytVideoID = $this.attr('data-video-id');
      var ytVideoPoster = $this.attr('data-video-poster');
      if ( $(window).width() < 944 || ($.browser.msie && parseInt($.browser.version, 10) == 7) ) {
        //go straight to youtube
        window.location = 'http://www.youtube.com/watch?v='+ytVideoID;
      } else {
        var posterImageTemp = $this.parent().parent().find('.mediaPoster');
        // Switch the poster image.
        posterImageTemp.attr("src", ytVideoPoster);
        // Hide the poster image (if exists)
        posterImageTemp.hide();
        // Get the iframe id to set the player.videoid and also set the iframe to position static.
        //$this.parents('.mediaPlayer').find('.youTubePlayerHolder').show().css('position','static');
        var videoFrameID = $this.parents('.mediaPlayer').find('iframe').attr("id");
        // Mark this row as active (mark others as none active first). 
        $('.videoRow').removeClass('active');
        $(this).addClass('active');
        // Change the video of the player.
        players[videoFrameID].loadVideoById(ytVideoID);
    }
    });
}

function onPlayerStateChange(event) {
    var VideoID;
    if ($('.videoRow.active').length > 0)
    {
        VideoID = $('.videoRow.active').attr('data-video-id');
    }
    else {
        var videourl = $('#ytVidPlayer1').attr('src');
        // if the ID ends with extra characters...
        if (videourl.indexOf('?') > -1) {
            // remove the extra characters
            videourl = videourl.substr(0, videourl.indexOf('?'));
        }
        VideoID = videourl.substr(videourl.indexOf('embed/index.html') + 7);
    }
    
    var videoTitle = "";

    //Get video title from youtube API
    $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + VideoID + '?v=2&alt=jsonc', function (data, status, xhr) {

        // if the video begins playing, send the event
        if (event.data == YT.PlayerState.PLAYING) {
            _gaq.push(['_trackEvent', 'Video', 'Play', data.data.title]);
        }

        // if the video ends, send the event
        if (event.data == YT.PlayerState.ENDED) {
            _gaq.push(['_trackEvent', 'Video', 'Ended', data.data.title]);
        }
    });

}

$(document).ready(function () {

    // Outbound Link Tracking with Google Analytics
    $("a").not('.blue_submit').on('click', function (e) {
        var url = $(this).attr("href");
        if (e.currentTarget.hostname != window.location.hostname) {
            console.log('issue remains');
            _gaq.push(['_trackEvent', 'External Link', 'Clicked', url]);
            if (e.metaKey || e.ctrlKey) {
               var newtab = true;
            }
            if (!newtab) {
                e.preventDefault();
                setTimeout(window.open(url, "_blank"), 100);
            }
        }
    });

    /*
      Audio/Podcast Player
      Setup For Jplayer Taking Inline Text To Instantiate The Playlist.
    */
    lh.audioPlayerAr = [];
    lh.$('.mediaModule .podcastWrap').each(function(index, el){
        var $playlist = $(el).find(".jp-playlist li").not(".more, .less");
        // build playlist from html list
        if ($playlist.length > 0)
        {
            var plAr = [];
            var playerIDstr = "#" + $(el).children(".jp-jplayer").first().attr("id");
            var containerIDstr = "#" + $(el).children(".jp-audio").first().attr("id");
            $playlist.each(function(){
                var element = $(this).find('a').text();
                var obj = {
                    title: element,
                    mp3: $(this).attr("data-audio-url")
                }; 
                plAr.push(obj);
            });    
            lh.audioPlayerAr[index] = new jPlayerPlaylist({
              jPlayer: playerIDstr,
              cssSelectorAncestor: containerIDstr
            }, plAr, {
              swfPath: "/media/js",
              supplied: "mp3",
              wmode: "window",
              displayTime: 0,
              autohide: [{fadeIn: "0"}]
            });
        } 
         
        // create more/less links
        if ($playlist.length > 5) {  
            $(el).find(".jp-playlist").append('<p class="more">Show More</p>'); 
            $(el).find(".jp-playlist").append('<p class="less hidden">Show Less</p>');  
        }      
    });  
    
    // wire up more link
    $(".jp-playlist").on("click", ".more", function(){
        $(this).parent(".jp-playlist").find("li").show();  
        $(this).siblings(".less").removeClass("hidden");
        $(this).addClass("hidden");
    });
    // wire up less link
    $(".jp-playlist").on("click", ".less", function(){
        $(this).parent(".jp-playlist").find("li:gt(4)").hide(); 
        $(this).siblings(".more").removeClass("hidden");
        $(this).addClass("hidden");
    });

});  // END doc ready    

function getTime(totalSec)
{
  hours = parseInt( totalSec / 3600 ) % 24;
  minutes = parseInt( totalSec / 60 ) % 60;
  seconds = parseInt( totalSec % 60, 10 );
  var result;
  result = ":" + (seconds  < 10 ? "0" + seconds : seconds);
  if (minutes > 0) {
    result = (minutes < 10 ? "0" + minutes : minutes) + result;
  } else {
    result = '00' + result;
  }
  if (hours > 0) {
    result = (hours < 10 ? "0" + hours : hours) + ":" + result;
  }
  return result;
}

/* for ie7 testing */
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

/* END Media Players ********************************/
