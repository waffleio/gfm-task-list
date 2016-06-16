import './development.scss';
import '../src/main';

const request = require('superagent');

$('.render-btn').click( () => {
  const markdown = $('.source').val();
  if (markdown.length) {
    request
      .post('https://api.github.com/markdown')
      .set('Authorization', `Bearer ${GH_ACCESS_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({
        mode: 'gfm',
        text: markdown
      })
      .end((err, res) => {
        $('.output').html(res.text);
        $('.output').gfmTaskList({
          markdownContainer: '.source',
          renderedContainer: '.output'
        });
      });
  }
});
