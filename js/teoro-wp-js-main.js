(function ($) {
    "use strict";

    var count = 1;

    animateElement();
    stopAnimateOnScroll();
    placeholderToggle();
    setSlowScroll();
    setMenu();
    stickyColumnWidth();
    stickyColumn();
    setActiveMenuItem();
    logoLinkFix();
    horizontalMenuTextFix();
    $(".site-content").fitVids();
    loadMoreArticleIndex();
    inputFieldsTextAnimation();
    if (is_touch_device()) {
        $('body').addClass('is-touch');
    }

    $(window).on('load', function () {
        $('#toggle').on("click", multiClickFunctionStop);
        setHash();
        $('.doc-loader').fadeOut();
    });

    $(window).on('resize', function () {
        setActiveMenuItem();
        stickyColumnWidth();
        $(".header-right-part").sticky('update');
    });

    $(window).on('scroll', function () {
        animateElement();
        setActiveMenuItem();
    });


//------------------------------------------------------------------------
//Helper Methods -->
//------------------------------------------------------------------------


    function stopAnimateOnScroll() {
        $("html, body").on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
            $("html, body").stop();
        });
    }

    function placeholderToggle() {
        $('input, textarea').on('focus', function () {
            $(this).data('placeholder', $(this).attr('placeholder'));
            $(this).attr('placeholder', '');
        });
        $('input, textarea').on('blur', function () {
            $(this).attr('placeholder', $(this).data('placeholder'));
        });
    }

    function horizontalMenuTextFix() {
        $(".site-title").css('top', $(".site-title").innerWidth());
        $(".menu-social").css('top', $(".menu-social").innerWidth() + $(".site-title").innerWidth());
    }

    function setSlowScroll() {
        $('#header-main-menu ul li a[href^="#"], a.button, .slow-scroll, .num-comments a, .elementor-button').on("click", function (e) {
            if ($(this).attr('href') === '#') {
                e.preventDefault();
            } else {
                if ($(window).width() < 1300) {
                    if (!$(e.target).is('.sub-arrow')) {
                        $('html, body').animate({scrollTop: $(this.hash).offset().top - 76}, 1500);
                        $('body').removeClass('cocobasic-open-menu cocobasic-open-menu-done');
                        $('#toggle').removeClass('on');
                        return false;
                    }
                } else {
                    $('html, body').animate({scrollTop: $(this.hash).offset().top - 76}, 1500);
                    return false;
                }
            }
        });
    }

    function multiClickFunctionStop(e) {
        $('#toggle').off("click");
        $('#toggle').toggleClass("on");
        $('body').toggleClass("cocobasic-open-menu").delay(500).queue(function (next) {
            $(this).toggleClass("cocobasic-open-menu-done");
            next();
        });
        $('#toggle').on("click", multiClickFunctionStop);
    }

    function setMenu() {
        $(".default-menu ul:first").addClass('sm sm-clean main-menu');
        $(".header-right-part").sticky({topSpacing: 0});

        $('.header-right-part').on('sticky-start', function () {
            $('body').addClass('menu-is-sticky');
        });

        $('.header-right-part').on('sticky-end', function () {
            $('body').removeClass('menu-is-sticky');
        });

        $('.one-page-section').each(function () {
            $(this).find('a:first').attr('href', ajax_var.webUrl + $(this).find('a:first').attr('href'));
        });

        $('.main-menu').smartmenus({
            subMenusSubOffsetX: 1,
            subMenusSubOffsetY: -8,
            markCurrentItem: true
        });

        var $mainMenu = $('.main-menu').on('click', 'span.sub-arrow', function (e) {
            var obj = $mainMenu.data('smartmenus');
            if (obj.isCollapsible()) {
                var $item = $(this).parent(),
                        $sub = $item.parent().dataSM('sub');
                $sub.dataSM('arrowClicked', true);
            }
        }).bind({
            'beforeshow.smapi': function (e, menu) {
                var obj = $mainMenu.data('smartmenus');
                if (obj.isCollapsible()) {
                    var $menu = $(menu);
                    if (!$menu.dataSM('arrowClicked')) {
                        return false;
                    }
                    $menu.removeDataSM('arrowClicked');
                }
            }
        });
    }

    function setActiveMenuItem() {
        var currentSection = null;
        $('.op-section').each(function () {
            var element = $(this).attr('id');
            if ($('#' + element).is('*')) {
                if ($(window).scrollTop() >= $('#' + element).offset().top - 115) {
                    currentSection = element;
                }
            }
        });

        $('#header-main-menu ul li').removeClass('active').find('a[href*="#' + currentSection + '"]').parent().addClass('active');
    }

    function setHash() {
        var hash = location.hash;
        if ((hash !== '') && ($(hash).length)) {
            $('html, body').animate({scrollTop: $(hash).offset().top}, 1);
            $('html, body').animate({scrollTop: $(hash).offset().top}, 1);
        } else {
            $(window).scrollTop(1);
            $(window).scrollTop(0);
        }
    }

    function logoLinkFix() {
        $('.site-title').on("click", function (e) {
            if ($('body').hasClass('page-template-onepage')) {
                e.preventDefault();
                $('html, body').animate({scrollTop: 0}, 1500);
            }
        });
    }

    function animateElement() {
        $(".animate").each(function (i) {
            var top_of_object = $(this).offset().top;
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            if ((bottom_of_window - 70) > top_of_object) {
                $(this).addClass('show-it');
            }
        });
    }

    function loadMoreArticleIndex() {
        if (parseInt(ajax_var.posts_per_page_index) < parseInt(ajax_var.total_index)) {
            $('.more-posts').css('visibility', 'visible');
            $('.more-posts').animate({opacity: 1}, 1500);
        } else {
            $('.more-posts, .more-posts-index-holder').css('display', 'none');
        }

        $('.more-posts:visible').on('click', function () {
            $('.more-posts').css('display', 'none');
            $('.more-posts-loading').css('display', 'inline-block');
            count++;
            loadArticleIndex(count);
        });
    }

    function loadArticleIndex(pageNumber) {
        $.ajax({
            url: ajax_var.url,
            type: 'POST',
            data: "action=infinite_scroll_index&page_no_index=" + pageNumber + '&loop_file_index=loop-index&security=' + ajax_var.nonce,
            success: function (html) {
                $('.blog-holder').imagesLoaded(function () {
                    $(".blog-holder").append(html);
                    setTimeout(function () {
                        animateElement();
                        if (count == ajax_var.num_pages_index) {
                            $('.more-posts').css('display', 'none');
                            $('.more-posts-loading').css('display', 'none');
                            $('.no-more-posts').css('display', 'inline-block');
                        } else {
                            $('.more-posts').css('display', 'inline-block');
                            $('.more-posts-loading').css('display', 'none');
                            $(".more-posts-index-holder").removeClass('stop-loading');
                        }
                    }, 100);
                });
            }
        });
        return false;
    }

    function inputFieldsTextAnimation() {
        $(".wpcf7 textarea, .wpcf7 input").on("focus", function () {
            $(this).parent().next(".input-default-text").addClass('has-content');
        });

        $(".wpcf7 textarea, .wpcf7 input").on("focusout", function () {
            if (!$(this).val()) {
                $(this).parent().next(".input-default-text").removeClass('has-content');
            }
        });

        $("#commentform textarea, #commentform input").on("focus", function () {
            $(this).siblings(".input-default-text").addClass('has-content');
        });

        $("#commentform textarea, #commentform input").on("focusout", function () {
            if (!$(this).val()) {
                $(this).siblings(".input-default-text").removeClass('has-content');
            }
        });
    }

    function stickyColumn() {
        $(".sticky-column").sticky({topSpacing: 0, getWidthFrom: '.sticky-column'});
    }

    function stickyColumnWidth() {
        if ($(".sticky-column").width() !== '0') {
            $(".sticky-column").removeAttr('style').css("width", $(".sticky-column").width());
        } else {
            $(".sticky-column").removeAttr('style').css("width", "auto");
        }
    }

    function is_touch_device() {
        return !!('ontouchstart' in window);
    }

})(jQuery);
/*This file was exported by "Export WP Page to Static HTML" plugin which created by ReCorp (https://myrecorp.com) */