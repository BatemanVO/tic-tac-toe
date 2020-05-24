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
    * Gets all empty spaces on the board and checks if any of them are the last space needed to make a winning move.
    * If so, returns the winning space's element Id. Otherwise, returns undefined.
    */
    HardMode.getWinningId = function() {
        var emptyIds = Array.from(document.querySelectorAll('.' + EMPTY_SPACE_CLASS)).map(function(emptySpace) {
            return emptySpace.id;
        });
        var markerById = {};
        for (var i = 0; i < WINNING_COMBINATIONS.length; i++) {
            var occupiedCount = 0;
            var occupiedMarker;
            var possibleWinningId = null;
            var winningCombination = WINNING_COMBINATIONS[i];
            for (var j = 0; j < winningCombination.length; j++) {
                var spaceId = winningCombination[j];
                if (emptyIds.includes(spaceId)) {
                    if (possibleWinningId) {
                        continue;
                    }
                    possibleWinningId = spaceId;
                } else {
                    var occupyingMarker = markerById[spaceId];
                    if (!occupyingMarker) {
                        occupyingMarker = document.getElementById(spaceId).className;
                        markerById[spaceId] = occupyingMarker;
                    }
                    if (occupiedCount === 0) {
                        occupiedMarker = occupyingMarker;
                        occupiedCount = 1;
                    } else if (occupiedMarker === occupyingMarker) {
                        occupiedCount = 2;
                    }
                }
            }
            if (occupiedCount === 2 && possibleWinningId) {
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
    module.exports = HardMode;
})();
