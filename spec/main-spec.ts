import '../src/main.scss';
import '../src/main';
import * as request from 'superagent';

describe('GFMTaskLists', () => {
  let $element:JQuery;

  const markdown:[string] = [
    "- [ ] item 1",
    "- [ ] item 2",
    "  - [ ] nested 1",
    "    - [ ] super nested 1"
  ];

  const renderMarkdown = (cb) : void => {
    request
      .post('https://api.github.com/markdown')
      .set('Authorization', `Bearer ${GH_ACCESS_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({
        mode: 'gfm',
        text: markdown.join('\n')
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
          return cb(err, res);
        }

        $element.find('.rendered-markdown').html(res.text);
        cb()
      });
  }

  beforeEach(() => {
    $element = $([
      '<div class="container">',
      '  <textarea class="markdown-editor"></textarea>',
      '  <div class="rendered-markdown"></div>',
      '</div>'
    ].join('\n'))
  });

  it('enables task lists', (done) => {
    renderMarkdown(() => {
      console.log($element.find('.rendered-markdown').html());
      done()
    });
  });

});
