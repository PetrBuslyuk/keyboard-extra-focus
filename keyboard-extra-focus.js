/**
 * Created by Petr Buslyuk on 26.10.17.
 */

'use strict';

keyboardExtraFocus.$inject = ['$rootScope', '$document'];

function keyboardExtraFocus($rootScope, $document) {

    var KEYS;

    return {
        restrict: 'A',
        scope: {
            extraOptions: '=?'
        },
        link: link
    };

    function link(scope, element) {
        const FOCUS_CLASS = 'keyboard-class';
        var activeDOMElement;

        scope.extraOptions = scope.extraOptions || {};

        // By default handle only TAB Key
        KEYS = scope.extraOptions.keys || [9];

        element.on('mousedown', onBlur);
        element.on('keyup', onKeyUp);

        $rootScope.$on('moveFocusTo', onMoveFocusTo);

        function onKeyUp(e) {
            var code = e.keyCode || e.which;

            if(KEYS.indexOf(code) !== -1)  {
                addExtraClass(e);
            }
        }

        function onMoveFocusTo(ev, data) {
            var focusElement;

            onBlur();

            if (data.query) {
                focusElement = $document.querySelector(data.query);
            }

            if (data.element) {
                focusElement = data.element;
            }

            if (focusElement) {
                focusElement.focus();
            }

            if(focusElement && !data.skipExtraClass) {
                addExtraClass(ev, focusElement);
            }
        }

        function addExtraClass(e, customElement) {
            activeDOMElement = angular.element(customElement || e.target);

            if(!activeDOMElement) return false;

            activeDOMElement.addClass(getExtraClass());
            activeDOMElement.on('blur', onBlur)
        }

        function onBlur() {
            if (!activeDOMElement) return false;

            activeDOMElement.removeClass(getExtraClass());
            activeDOMElement.off('blur', onBlur);
        }

        function getExtraClass() {
            return scope.extraOptions.focusClass || FOCUS_CLASS;
        }

    }
}

module.exports = keyboardExtraFocus;