/**
 * Find a Pair - a simple CSS + JS game
 * coded by Anatol Merezhanyi @e1r0nd_crg
 * https://www.youtube.com/c/AnatolMerezhanyi
 */
const elements = {
  menuBox: document.querySelector('#menuBox'),
  startBox: document.querySelector('#startBox'),
  startLnk: document.querySelector('#startLnk'),
  exitLnk: document.querySelector('#exitLnk'),
  scoresBox: document.querySelector('#scoresBox'),
  scoresLnk: document.querySelector('#scoresLnk'),
  aboutBox: document.querySelector('#aboutBox'),
  aboutLnk: document.querySelector('#aboutLnk'),
  scoresList: document.querySelector('#scoresList'),
  readyShevron: document.querySelector('#readyShevron'),
  playboard: document.querySelector('#playboard'),
  startCounter: document.querySelectorAll('.start__counter'),
  isAnimated: false,
  scores: [],
  currentScores: 0,
  shape: ['round', 'square'],
  background: ['dots', 'shippo', 'tablecloth', 'checkboard', 'stripes'],
  rotation: ['', 'clockwise', 'c-clockwise', 'tick', 'c-tick', 'phase', 'c-phase'],
  horSegments: 2,
  verSegments: 2,
  boardHorSize: 480,
  boardVerSize: 480,
  figures: [],
  chips: [],
  selected: []
};
const randInteger = (min, max) => Math.round(Math.random() * (max - min) + min);

['scoresBox', 'aboutLnk', 'aboutBox']
  .forEach((el) => {
    elements[el].addEventListener('click', toggleModal);
  });
elements.startLnk.addEventListener('click', openBoard);
elements.exitLnk.addEventListener('click', closeBoard);
elements.scoresLnk.addEventListener('click', openScores);
elements.startCounter[0].addEventListener('transitionend', gameOver);

function toggleModal(_this) {
  _this = (this === window) ? _this : this;
  if (elements.isAnimated) {
    return false;
  }
  elements.isAnimated = true;
  elements[_this.dataset.hide].classList.add('u--blur-fadeout');
  elements[_this.dataset.show].classList.remove('u--blur-fadeout');
  elements[_this.dataset.hide].addEventListener('transitionend', () => {
    elements.isAnimated = false;
}, false);
}

function openScores(gameOver) {
  let htmlTemplate = '';
  let _this = this;
  
  elements.scores.length = 5;
  for (let i = 0; i < 5; i++) {
    htmlTemplate += `<li class="scores__item">${'undefined' == typeof elements.scores[i] ? '' : elements.scores[i]}</li>`;
  }
  scoresList.innerHTML = htmlTemplate;
  if (gameOver) {
    _this = scoresLnk;
    elements.isAnimated = false;
  }
  toggleModal(_this);
}

function closeBoard() {
  toggleModal(this);
  
  setTimeout(() => {
    elements.readyShevron.classList.remove('u--unscale');
    elements.playboard.classList.add('u--fadeout');
    elements.startCounter.forEach((el) => {
      el.classList.remove('start__counter--collapse');
    });
  }, 300);
}

function openBoard() {
  elements.readyShevron.innerHTML = 'Ready?';
  elements.currentScores = 0;
  elements.verSegments = 2;
  elements.horSegments = 2;
  toggleModal(this);
  setTimeout(() => {
    elements.readyShevron.classList.add('u--unscale');
    elements.startCounter.forEach((el) => {
      el.classList.add('start__counter--collapse')
    });
    
    generateChips();
    elements.playboard.classList.remove('u--fadeout');
  }, 1000);
}

function checkForDuplicate() {
  if (this.classList.contains('selected')) {
    return;
  }
  this.classList.add('selected');
  elements.selected.push(this);
    if (elements.selected.length > 1) {
      if (elements.selected[0].classList.value === elements.selected[1].classList.value) {
        nextRound();
      } else {
        gameOver();
      }
    }
}

function generateChips() {
  let htmlTemplate = '';
  let xPos = 10;
  let yPos = 10
  const computedStyles = [];
  const numFigures = elements.horSegments * elements.verSegments;
  const first = randInteger(0, numFigures/2 - 1);
  const second = randInteger(numFigures/2, numFigures - 1);
  elements.selected.length = 0;
  elements.figures.length = 0;
  
  while(elements.figures.length < numFigures) {
    let x = randInteger(0, elements.boardHorSize / elements.horSegments - 55);
    let y = randInteger(0, elements.boardVerSize / elements.verSegments - 50);
    let styles = 'chip--' + elements.shape[randInteger(0, 1)] + ' chip--' + elements.background[randInteger(0, 4)] + ' chip--' + elements.rotation[randInteger(0, 6)];
    if (!computedStyles.includes(styles)) {
      // (first === elements.figures.length) && (styles += ' u--selected'); // uncomment this for hints
      (second === elements.figures.length) && (styles = computedStyles[first]);
      htmlTemplate = `<div class="chip ${styles}" style="top:${yPos + y}px; left:${xPos + x}px"></div>`;
      computedStyles.push(styles);
      xPos += elements.boardHorSize / elements.horSegments;
      if (xPos > elements.boardHorSize) {
        xPos = 10
        yPos += elements.boardVerSize / elements.verSegments;
      }
      elements.figures.push(htmlTemplate);
    }
  }
  
  playboard.innerHTML = elements.figures.join('');
  
  elements.chips = document.querySelectorAll('.chip');
  elements.chips.forEach((el) => {
    el.addEventListener('click', checkForDuplicate);
  });
}

function nextRound() {
  const playboardFadeIn = () => {
    generateChips();
    playboard.classList.remove('u--fadeout');
    playboard.removeEventListener('transitionend', playboardFadeIn);
  }
  
  (elements.verSegments < 5) && ((elements.verSegments < elements.horSegments) ? elements.verSegments++ : elements.horSegments++);
  elements.currentScores++;
  playboard.classList.add('u--fadeout');
  playboard.addEventListener('transitionend', playboardFadeIn); 
}

function gameOver() {
  elements.scores.unshift(elements.currentScores);
  elements.chips.forEach((el) => {
    el.classList.remove('chip--clockwise', 'chip--c-clockwise', 'chip--tick', 'chip--c-tick', 'chip--phase', 'chip--c-phase');
    setTimeout(() => {
      el.classList.add('u--unscale');
      readyShevron.innerHTML = 'Game over';
      readyShevron.classList.remove('u--unscale');
    }, 0);
  });
  setTimeout(() => {
    exitLnk.click();
    openScores(true);
  }, 1000);
}