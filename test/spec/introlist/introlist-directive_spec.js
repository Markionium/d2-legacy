"use strict";

describe('introlist-directive should create an introlist', function() {
    var element, scope;

    beforeEach(module('d2-introlist'));
    beforeEach(module('components/common/introlist/introlist.html'));

    beforeEach(inject(function( $compile, $rootScope ) {
        scope = $rootScope.$new();
        scope.itemList = [
            {
                id: "dataelement",
                name: "Data Element",
                description: "Create, modify, view and delete data elements. Data elements are phenomena for which will be captured and analysed.",
                icon: 'data_element.png',
                menuItems: []
            },
            {
                id: "dataelementgroup",
                name: "Data Element Group",
                description: "Create, modify, view and delete data element groups. Groups are used for improved analysis."
            }
        ];
        scope.clickFunction = function (name) {
            console.log(name);
        };

        element = angular.element('<d2-intro-list item-list="itemList" item-click="clickFunction(item)" />');

        $compile(element)(scope);
        scope.$digest();
    }));

    it('should add a div with a d2-intro-list class to the DOM', function() {
        expect(element.hasClass('d2-intro-list')).toBe(true);
    });

    it('should add an li element for each of the passed values', function () {
        var numberOfListElements = element.find('li').length;

        expect(numberOfListElements).toBe(2);
    });

    it('should give the class "intro-list-item" to each of the item elements', function () {
        var listElements = element.find('li');

        expect(listElements.hasClass('intro-list-item')).toBe(true);
    });

    it('should display the name of the item in a element with class intro-list-title', function () {
        var titleElement = element.find('li').first().find('.intro-list-title'),
            firstElementName = scope.itemList[0].name;

        expect(titleElement.html()).toBe(firstElementName);
    });

    it('should display an image for the item that uses the name in lowecase', function () {
        var imageElement = element.find('li').first().find('.intro-list-image');

        expect(imageElement.attr('src')).toBe('../icons/data_element.png');
    });

    it('should not add an icon when no icon is given', function () {
         var imageElement = element.find('li').last().find('.intro-list-image');

        expect(imageElement.length).toBe(0);
    });

    it('should display the description in an element with class intro-list-description', function () {
        var descriptionElement = element.find('li').first().find('.intro-list-description'),
            firstItemDescription = scope.itemList[0].description;

        expect(descriptionElement.html()).toBe(firstItemDescription);
    });

    it('should add a function to be called when an element is clicked', function () {
        spyOn(scope, 'clickFunction');

        element.find('li').click();

        expect(scope.clickFunction).toHaveBeenCalled();
    });

    it('should only fire the click function for the callback being called', function () {
        spyOn(scope, 'clickFunction');

        element.find('li').first().click();

        expect(scope.clickFunction.callCount).toBe(1);
    });

    it('should call the callback with the name of the first item', function () {
        var expectedItem = {
                id : 'dataelement',
                name : 'Data Element',
                description : 'Create, modify, view and delete data elements. Data elements are phenomena for which will be captured and analysed.',
                icon : 'data_element.png',
                menuItems: []
        };
        spyOn(scope, 'clickFunction');

        element.find('li').first().click();

        expect(scope.clickFunction).toHaveBeenCalledWith(expectedItem);
    });

    it('should call the callback with the name of the last item and only call it once', function () {
        var  expectedItem = {
                id : 'dataelementgroup',
                name : 'Data Element Group',
                description : 'Create, modify, view and delete data element groups. Groups are used for improved analysis.'
        };

        spyOn(scope, 'clickFunction');

        element.find('li').last().click();

        expect(scope.clickFunction.callCount).toBe(1);
        expect(scope.clickFunction).toHaveBeenCalledWith(expectedItem);
    });
});
