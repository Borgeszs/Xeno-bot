// Apenas GIFs — sem textos
const memes = [
  {
    type: 'gif',
    url: 'https://media1.tenor.com/m/m0k6o6eUdGgAAAAC/eu-entendendo-tudo-gohan.gif',
    legenda: null,
  },
  {
    type: 'gif',
    url: 'https://media.discordapp.net/attachments/1491211680624152707/1515920146630316042/image0.gif',
    legenda: null,
  },
];

function getMemeAleatorio() {
  return memes[Math.floor(Math.random() * memes.length)];
}

module.exports = { getMemeAleatorio };
