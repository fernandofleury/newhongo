import words from './words.js';

const JISHO_API = 'https://jisho.org/api/v1/search/words';

const random = arr => arr[Math.floor(Math.random() * arr.length)];

const getKeywordInfo = keyword =>
  fetch(`${JISHO_API}?keyword=${keyword}`)
    .then(res => res.json())
    .then(({ data }) => {
      return {
        word: data[0].japanese[0].word,
        reading: data[0].japanese[0].reading,
        definition: data[0].senses[0].english_definitions.join(', ')
      };
    });

const getElement = query => document.querySelector(query);
const getSpeech = word => {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = 'ja';

  return speech;
};

document.addEventListener('DOMContentLoaded', () => {
  const keyword = random(words);

  getKeywordInfo(keyword).then(({ word, reading, definition }) => {
    getElement('.word').textContent = word || reading;

    if (word) {
      getElement('.reading').textContent = reading;
    }

    getElement('.definition').textContent = definition;
    getElement('.audio').innerHTML = 'press <strong>space</strong> for audio';

    document.body.addEventListener('keyup', e => {
      if (e.keyCode === 32) {
        window.speechSynthesis.speak(getSpeech(word || reading));
      }
    });
  });
});
