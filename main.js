document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    let width = 10;
    let squares = [];
    let bombs = 20;
    let isGameOver = false;
    let flags = 0;

    function createBoard() {
        flagsLeft.innerHTML = bombs;

        const bombsArr = new Array(bombs).fill('bomb');
        const emptyArr = new Array((width*width - bombs)).fill('valid');
        const gameArr = emptyArr.concat(bombsArr);
        const shuffleArr = gameArr.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffleArr[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function(e){
                clickFunc(square);
            });

            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlags(square);
            }
        }

        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEnd = (i % width === 0);
            const isRightEnd = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEnd && squares[i - 1].classList.contains('bomb')) {
                    total++;
                }
                if (i > 9 && !isRightEnd && squares[i + 1 - width].classList.contains('bomb')) {
                    total++;
                }
                if (i > 10 && squares[i - width].classList.contains('bomb')) {
                    total++;
                }
                if (i > 11 && !isLeftEnd && squares[i - 1 - width].classList.contains('bomb')) {
                    total++;
                }
                if (i < 98 && !isRightEnd && squares[i + 1].classList.contains('bomb')) {
                    total++;
                }
                if (i < 90 && !isLeftEnd && squares[i - 1 + width].classList.contains('bomb')) {
                    total++;
                }
                if (i < 88 && !isRightEnd && squares[i + 1 + width].classList.contains('bomb')) {
                    total++;
                }
                if (i < 89 && squares[i + width].classList.contains('bomb')) {
                    total++;
                }
                squares[i].setAttribute('data', total);
            }
        }
    }
    createBoard();

    function addFlags(square) {
        if (isGameOver) {
            return;
        }

        if (!square.classList.contains('checked') && (flags < bombs)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombs - flags;
                checkWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = bombs - flags;
            }
        }
    }

    function clickFunc(square) {
        let currId = square.id;

        if (isGameOver) {
            return;
        }

        if (square.classList.contains('checked') || square.classList.contains('flag')) {
            return;
        }

        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                if (total == 1) {
                    square.classList.add('one');
                }
                if (total == 2) {
                    square.classList.add('two');
                }
                if (total == 3) {
                    square.classList.add('three');
                }
                if (total == 4) {
                    square.classList.add('four');
                }
                square.innerHTML = total;
                return;
            }
            check(square, currId);
        }
        square.classList.add('checked');
    }

    function check(square, currId) {
        const isLeftEnd = (currId % width === 0);
        const isRightEnd = (currId % width === width - 1);

        setTimeout(() => {
            if (currId > 0 && !isLeftEnd) {
                const newId = squares[parseInt(currId) - 1].id;
                const newSquare = document.getElementById(newId);
                clickFunc(newSquare);
            }
            if (currId > 9 && !isRightEnd) {
                const newId = squares[parseInt(currId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                clickFunc(newSquare);
            }
            if (currId > 10) {
                const newId = squares[parseInt(currId) - width].id;
                const newSquare = document.getElementById(newId);
                clickFunc(newSquare);
            }
            if (currId > 11 && !isLeftEnd) {
                const newId = squares[parseInt(currId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                clickFunc(newSquare);
            }
            if (currId < 98 && !isRightEnd) {
                const newId = squares[parseInt(currId) + 1].id;
                const newSquare = document.getElementById(newId);
                clickFunc(newSquare);
            }
            if (currId < 90 && !isLeftEnd) {
                const newId = squares[parseInt(currId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                clickFunc(newSquare);
            }
            if (currId < 88 && !isRightEnd) {
                const newId = squares[parseInt(currId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                clickFunc(newSquare);
            }
            if (currId < 89) {
                const newId = squares[parseInt(currId) + width].id;
                const newSquare = document.getElementById(newId);
                clickFunc(newSquare);
            }
        }, 10);
    }

    function gameOver(square) {
        result.innerHTML = 'Game Over!';
        isGameOver = true;

        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
            }
        });
    }

    function checkWin() {
        let matches = 0;

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombs) {
                result.innerHTML = 'Congratulations! YOU WON!';
                isGameOver = true;
            }
        }
    }
});