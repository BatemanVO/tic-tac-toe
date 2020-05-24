/******************************************************************************************************************
* @description          Class that can be optionally enabled to override the choice of which element to choose in the
*                       tic-tac-toe.js file's computerMove method. Written using only pre-ES6 features to help junior
*                       developers learning JavaScript have an easier time reading.
* @createdDate          05/23/2020
* @author               Steven Bateman
*******************************************************************************************************************
* Modification Log
* Developer name        Date                Description of changes
******************************************************************************************************************/
var HardMode = {};
(function() {
    var EMPTY_SPACE_CLASS = 'unmarked';
    var WINNING_COMBINATIONS = [
        ['a-box', 'b-box', 'c-box'],
        ['d-box', 'e-box', 'f-box'],
        ['g-box', 'h-box', 'i-box'],
        ['a-box', 'd-box', 'g-box'],
        ['b-box', 'e-box', 'h-box'],
        ['c-box', 'f-box', 'i-box'],
        ['a-box', 'e-box', 'i-box'],
        ['c-box', 'e-box', 'g-box']
   ];

   HardMode.isEnabled = false;

    /**
    * Gets all empty spaces on the board, then checks each winning combination.
    * If two empty spaces are found, move on to the next combination.
    * If one empty space is found and the other two spaces are occupied by different markers, move on.
    * If no empty spaces are found, move on to the next combination.
    * If one empty space is found and the other two spaces are occupied by the same marker, return the empty Id, since
    * that is the winning move - either for the computer to win now, or to block the player from winning on their next
    * turn.
    */
    HardMode.getWinningId = function() {
        var emptyIds = Array.from(document.querySelectorAll('.' + EMPTY_SPACE_CLASS)).map(function(emptySpace) {
            return emptySpace.id;
        });
        var markerById = {};
        for (var i = 0; i < WINNING_COMBINATIONS.length; i++) {
            var firstOccupiedSpaceMarker = null;
            var possibleWinningId = null;
            var winningCombination = WINNING_COMBINATIONS[i];
            for (var j = 0; j < winningCombination.length; j++) {
                var spaceId = winningCombination[j];
                if (emptyIds.includes(spaceId)) {
                    if (possibleWinningId !== null) {
                        break;
                    }
                    possibleWinningId = spaceId;
                } else {
                    var occupyingMarker = markerById[spaceId];
                    if (occupyingMarker === undefined) {
                        occupyingMarker = document.getElementById(spaceId).className;
                        markerById[spaceId] = occupyingMarker;
                    }
                    if (firstOccupiedSpaceMarker === null) {
                        firstOccupiedSpaceMarker = occupyingMarker;
                    } else if (firstOccupiedSpaceMarker !== occupyingMarker) {
                        break;
                    }
                }
            }
            if (possibleWinningId) {
                return possibleWinningId;
            }
        }
    };

    /**
    * Determines an element for the computer to place a marker in, according to the following priority:
    * 1. Winning move (either for the computer or to block the player)
    * 2. Center space
    * 3. Corner space
    * 4. Any remaining available space
    */
    HardMode.computerMove = function() {
        var winningId = HardMode.getWinningId();
        if (winningId) {
            return document.getElementById(winningId);
        }

        var centerSpace = document.getElementById('e-box');
        if (centerSpace.className === EMPTY_SPACE_CLASS) {
            return centerSpace;
        }

        var emptyCornerSelectors = ['a-box', 'c-box', 'g-box', 'i-box'].map(function(id) {
            return '#' + id + '.' + EMPTY_SPACE_CLASS;
        });
        var emptyCorner = document.querySelector(emptyCornerSelectors.toString());
        if (emptyCorner) {
            return emptyCorner;
        }

        return document.querySelector('.' + EMPTY_SPACE_CLASS);
    };

    HardMode.toggleHardModeSliderVisibility = function() {
        document.querySelector('.toggle-container').classList.toggle('hide');
    };

    HardMode.toggleEnabled = function(event) {
        event.target.classList.toggle('enabled');
        HardMode.isEnabled = !HardMode.isEnabled;
        document.querySelector('.hard-mode-toggle').classList.toggle('fill-enabled');
    };

    document.querySelector('.toggle-button').addEventListener('click', HardMode.toggleEnabled);
    // Needed for testing via Node libraries - module object is defined in a script tag above this one in the markup
    // to prevent errors from being thrown
    module.exports = HardMode;
})();
