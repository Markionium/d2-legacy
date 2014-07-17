"use strict";
describe('d2-header-bar directive', function () {
    var element, scope;

    beforeEach(module('d2-headerbar'));
    beforeEach(module('components/common/headerbar/headerbar.html'));

    describe('with attributes', function () {

        beforeEach(inject(function( $compile, $rootScope ) {
            scope = $rootScope.$new();

            element = angular.element('<d2-header-bar title="DHIS 2 Demo - Sierra Leone" link="../dhis-web-dashboard-integration/index.action" />');

            $compile(element)(scope);
            scope.$digest();
        }));

        it('should take the title from the title attribute', function () {
            var title = element.find('.header-text').html().trim();
            expect(title).toBe('DHIS 2 Demo - Sierra Leone');
        });

        it('should take link from the link attribute', function () {
            var hrefTitle = element.find('a').attr('href');
            expect(hrefTitle).toBe('../dhis-web-dashboard-integration/index.action');
        });

        it('should take the title and add that as a title attribute to the link', function () {
            var href = element.find('a').attr('title');
            expect(href).toBe('DHIS 2 Demo - Sierra Leone');
        });

        it('should add the image before the title', function () {
            var elementAfterImage = element.find('img').next()[0],
                textElement = element.find('span')[0];

            expect(elementAfterImage).toBe(textElement);
        });

        it('should put the image element and the text element in an A tag', function () {
            var linkElementChildren = element.find('a').children();

            expect(linkElementChildren[0]).toBe(element.find('img')[0]);
            expect(linkElementChildren[1]).toBe(element.find('span')[0]);
        });

        it('should add the header-logo class to the img tag', function () {
            var imageElement = element.find('img');
            expect(imageElement.hasClass('header-logo')).toBe(true);
        });

        it('should add the header-text class to the span tag', function () {
            var textElement = element.find('span');
            expect(textElement.hasClass('header-text')).toBe(true);
        });
    });

    describe('without attributes', function () {

        beforeEach(inject(function( $compile, $rootScope ) {
            scope = $rootScope.$new();

            element = angular.element('<d2-header-bar />');

            $compile(element)(scope);
            scope.$digest();
        }));

        it('should set the default title', function () {
            var title = element.find('.header-text').html().trim();
            expect(title).toBe('District Health Information Software 2');
        });

        it('should set the default link', function () {
            var link = element.find('a').attr('href');
            expect(link).toBe('../dhis-web-dashboard-integration/index.action');
        });

        it('should set the default icon', function () {
            var icon = element.find('img').attr('src');
            expect(icon).toBe('../dhis-web-commons/css/light_blue/logo_banner.png');
        });

        it('should take the default title and add that as a title attribute to the link', function () {
            var hrefTitle = element.find('a').attr('title');
            expect(hrefTitle).toBe('District Health Information Software 2');
        });
    });

    describe('inception (transclude)', function () {
        beforeEach(inject(function( $compile, $rootScope ) {
            scope = $rootScope.$new();

            element = angular.element('<d2-header-bar><p>Some text</p></d2-header-bar>');

            $compile(element)(scope);
            scope.$digest();
        }));

        it('should transclude the content into the headerbar', function () {
            var content = element.find('p');
            expect(content.html()).toBe('Some text');
        });

        it('should put the transclude content into a wrapping div', function () {
            var contentParent = element.find('p').parent();
            expect(contentParent.prop('tagName')).toBe('DIV');
        });
    });

});
