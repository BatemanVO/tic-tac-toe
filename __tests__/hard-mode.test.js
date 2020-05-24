describe('HardMode', () => {
    const CROSS_MARKER = 'cross';
    const NOUGHT_MARKER = 'nought';
    let HardMode;
    beforeEach(function() {
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].forEach(letter => {
            const div = document.createElement('div');
            div.id = `${letter}-box`;
            div.className = 'unmarked';
            document.body.appendChild(div);
        });

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'toggle-container hide';
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'hard-mode-toggle';
        const toggleButton = document.createElement('toggle-button');
        toggleButton.className = 'toggle-button';
        toggleDiv.appendChild(toggleButton);
        toggleContainer.appendChild(toggleDiv);
        document.body.appendChild(toggleContainer);
        HardMode = require('../js/hard-mode.js');
    });
    afterEach(function() {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('Initialization', () => {
        it('Should set isEnabled to false', () => {
            expect(HardMode.isEnabled).toBe(false);
        });
    });

    describe('getWinningId', () => {
        describe('With the same marker having two of three spaces horizontally needed to win on the board', () => {
            it('Should return the id of the last space needed to win', () => {
                document.getElementById('a-box').className = CROSS_MARKER;
                document.getElementById('b-box').className = CROSS_MARKER;
                expect(HardMode.getWinningId()).toBe('c-box');
            });
        });

        describe('With the same marker having two of the three spaces vertically needed to win on the board', () => {
            it('Should return the id of the last space needed to win', () => {
                document.querySelectorAll('#a-box, #c-box, #i-box').forEach(element => element.className = NOUGHT_MARKER);
                document.querySelectorAll('#b-box, #e-box, #g-box').forEach(element => element.className = CROSS_MARKER);
                expect(HardMode.getWinningId()).toBe('h-box');
            });
        });

        describe('With two spaces occupied in a winning combination, but by different markers', () => {
            it('Should return undefined', () => {
                document.getElementById('a-box').className = CROSS_MARKER;
                document.getElementById('b-box').className = NOUGHT_MARKER;
                expect(HardMode.getWinningId()).toBeUndefined();
            });
        });

        describe('With less than two spaces occupied in all winning combinations', () => {
            it('Should return undefined', () => {
                document.getElementById('c-box').className = CROSS_MARKER;
                document.getElementById('d-box').className = NOUGHT_MARKER;
                expect(HardMode.getWinningId()).toBeUndefined();
            });
        });

        describe('With a fresh board', () => {
            it('Should return undefined', () => {
                expect(HardMode.getWinningId()).toBeUndefined();
            });
        });
    });

    describe('computerMove', () => {
        const expectComputerMoveToBeElementWithId = function(expectedId) {
            const moveElement = HardMode.computerMove();
            expect(moveElement).not.toBeUndefined();
            expect(moveElement).not.toBeNull();
            expect(moveElement.id).toBe(expectedId);
        };

        describe('With a winning space open', () => {
            it('Should return the element matching the winning space', () => {
                document.getElementById('a-box').className = CROSS_MARKER;
                document.getElementById('b-box').className = CROSS_MARKER;
                expectComputerMoveToBeElementWithId('c-box');
            });
        });

        describe('With a winning space not available', () => {
            describe('With the center space available', () => {
                it('Should return the center space element', () => {
                    expectComputerMoveToBeElementWithId('e-box');
                });
            });

            describe('With the center space occupied', () => {
                describe('With a corner space available', () => {
                    it('Should return the first available corner space', () => {
                        document.querySelectorAll('#e-box, #a-box').forEach(element => element.className = CROSS_MARKER);
                        document.querySelector('#i-box').className = NOUGHT_MARKER;
                        expectComputerMoveToBeElementWithId('c-box');
                    });
                });

                describe('With no corner space available', () => {
                    it('Should return the first available side space', () => {
                        document.querySelectorAll('#e-box, #a-box, #c-box, #h-box')
                            .forEach(element => element.className = CROSS_MARKER);
                        document.querySelectorAll('#i-box, #b-box, #g-box')
                            .forEach(element => element.className = NOUGHT_MARKER);
                        expectComputerMoveToBeElementWithId('d-box');
                    });
                });
            });
        });
    });

    describe('Calling toggleHardModeSliderVisibility', () => {
        describe('Once', () => {
            it('Should remove the hide class from the toggle-container element', () => {
                HardMode.toggleHardModeSliderVisibility();
                expect(document.body.querySelector('.toggle-container').classList).not.toContain('hide');
            });
        });

        describe('Twice', () => {
            it('Should add the hide class back to the toggle-container element', () => {
                HardMode.toggleHardModeSliderVisibility();
                HardMode.toggleHardModeSliderVisibility();
                expect(document.body.querySelector('.toggle-container').classList).toContain('hide');
            });
        });
    });

    describe('Calling toggleEnabled', () => {
        describe('Once', () => {
            it(
                'Should set isEnabled to true, add the enabled class to the toggle-button, and add the fill-enabled' +
                ' class to the hard-mode-toggle element',
                () => {
                    HardMode.isEnabled = false;
                    const toggleButton = document.body.querySelector('.toggle-button');
                    HardMode.toggleEnabled({ target: toggleButton });
                    expect(HardMode.isEnabled).toBe(true);
                    expect(toggleButton.classList).toContain('enabled');
                    expect(document.body.querySelector('.hard-mode-toggle').classList).toContain('fill-enabled');
                }
            );
        });

        describe('Twice', () => {
            it(
                'Should set isEnabled to false, remove the enabled class to the toggle-button, and remove the' +
                ' fill-enabled class to the hard-mode-toggle element',
                () => {
                    HardMode.isEnabled = false;
                    const toggleButton = document.body.querySelector('.toggle-button');
                    HardMode.toggleEnabled({ target: toggleButton });
                    HardMode.toggleEnabled({ target: toggleButton });
                    expect(toggleButton.classList).not.toContain('enabled');
                    expect(HardMode.isEnabled).toBe(false);
                    expect(document.body.querySelector('.hard-mode-toggle').classList).not.toContain('fill-enabled');
                }
            );
        });
    });
});
