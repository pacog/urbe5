(function() {
    'use strict';

    var PARALLAX_SIZE = 80;
    var HEADER_SCROLL_LIMIT = 50;
    var HEADER_SCROLLED_CLASS = 'is-scrolled';
    var sections = [];
    var headerElement = null;
    var sectionsData = [];
    var sectionButtons = [];
    var sectionButtonsData = [];
    var currentSection = null;
    var windowHeight = null;
    var documentHeight = null;
    var verticalParallaxElements;

    if(window.docReady) {
        window.docReady(init);
    }

    function init() {
        if(browserIsSupported()) {
            storeElements();
            window.addEventListener('scroll', onScroll); //TODO: throttle
            window.addEventListener('resize', onResize);
            onResize();
            onScroll();
        }
    }

    function browserIsSupported() {
        return  !!window &&
                !!window.addEventListener &&
                !!document.querySelectorAll;
    }

    function storeElements() {
        sections = document.querySelectorAll('[section]');
        sectionButtons = document.querySelectorAll('[section-button]');
        headerElement = document.querySelector('.js-header');
    }

    function onResize() {
        storeWindowSize();
        storeSectionsData();
        storeSectionsButtonsData();
        storeParallaxElements();
    }

    function storeSectionsData() {
        if(sections && sections.length) {
            for(var i=0; i<sections.length; i++) {
                var sectionName = sections[i].getAttribute('section');

                sectionsData.push({
                    sectionName: sectionName,
                    element: sections[i],
                    offsetTop: sections[i].offsetTop
                });
            }
        }
    }


    function storeSectionsButtonsData() {
        if(sectionButtons && sectionButtons.length) {
            for(var i=0; i<sectionButtons.length; i++) {
                var sectionName = sectionButtons[i].getAttribute('section-button');
                sectionButtonsData.push({
                    sectionName: sectionName,
                    element: sectionButtons[i],
                    offsetTop: sectionButtons[i].offsetTop
                });
            }
        }
    }

    function storeParallaxElements() {
        verticalParallaxElements = [];
        var elements = document.querySelectorAll('.js-vertical-parallax');
        for(var i=0; i < elements.length; i++) {
            verticalParallaxElements.push({
                element: elements[i],
                offsetTop: elements[i].offsetParent.offsetTop
            });
        }
    }

    function onScroll() {
        var scrollTop = window.scrollY || window.pageYOffset || 0;
        var middleOfScreen = scrollTop + windowHeight/2;

        detectCurrentSection(middleOfScreen);
        updateParallaxImages(scrollTop);
        updateHeader(scrollTop);
    }

    function updateHeader(scrollTop) {
        if(headerElement) {
            if(scrollTop > HEADER_SCROLL_LIMIT) {
                addClass(headerElement, HEADER_SCROLLED_CLASS);
            } else {
                removeClass(headerElement, HEADER_SCROLLED_CLASS);
            }
            
        }
    }

    function storeWindowSize() {
        var body = document.body;
        var html = document.documentElement;
        windowHeight = Math.max(html.clientHeight, window.innerHeight || 0);
        documentHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    }

    function updateParallaxImages(scrollTop) {
        if(verticalParallaxElements && documentHeight && (documentHeight - windowHeight > 0)) {
            for(var i=0; i<verticalParallaxElements.length; i++) {
                var parallaxToApply = getParallaxToApply(scrollTop, verticalParallaxElements[i]);
                setVerticalTranslate(verticalParallaxElements[i].element, parallaxToApply);
            }
        }
    }

    function getParallaxToApply(scrollTop, element) {
        var percentage = (element.offsetTop - scrollTop)/(windowHeight);
        if(percentage < 0) {
            percentage = 0;
        }
        if(percentage > 1) {
            percentage = 1;
        }
        return PARALLAX_SIZE*percentage;
    }

    function setVerticalTranslate(element, translate) {
        var transformString = 'translate3d(0,' + translate + 'px,0)';
        element.style['-moz-transform'] = transformString;
        element.style['-webkit-transform'] = transformString;
        element.style['-ms-transform'] = transformString;
        element.style['transform'] = transformString;
    }

    function detectCurrentSection(scrollTop) {
        if(sectionsData && sectionsData.length) {
            var newCurrentSection = sectionsData[0].sectionName;

            for(var i=1; i<sectionsData.length; i++) {
                if(scrollTop >= sectionsData[i].offsetTop) {
                    newCurrentSection = sectionsData[i].sectionName;
                }
            }
            if(currentSection !== newCurrentSection) {
                setCurrentSection(newCurrentSection);
            }
        }
    }

    function setCurrentSection(newCurrentSection) {
        currentSection = newCurrentSection;
        if(sectionButtonsData && sectionButtonsData.length) {
            for(var i=0; i<sectionButtonsData.length; i++) {
                if(sectionButtonsData[i].sectionName === newCurrentSection) {
                    addClass(sectionButtonsData[i].element, 'active');
                } else {
                    removeClass(sectionButtonsData[i].element, 'active');
                }
            }
        }
    }


    function addClass(element, className) {
        if(!hasClass(element, className)) {
            element.className += (' ' + className);
        }
    }

    function removeClass(element, className) {
        if(hasClass(element, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            element.className = element.className.replace(reg,' ');
        }
    }

    function hasClass(element, className) {
        return element.className.indexOf(className) > -1;
    }

})();