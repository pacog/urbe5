(function() {
    'use strict';

    var sections = [];
    var sectionsData = [];
    var sectionButtons = [];
    var sectionButtonsData = [];
    var currentSection = null;

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
    }

    function onResize() {
        storeSectionsData();
        storeSectionsButtonsData();
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

    function onScroll() {
        var scrollTop = window.scrollY || window.pageYOffset || 0;
        var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var middleOfScreen = scrollTop + windowHeight/2;
        detectCurrentSection(middleOfScreen);
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