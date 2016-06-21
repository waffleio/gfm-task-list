import '../src/main.scss';
import '../src/main';
import * as request from 'superagent';

describe('GFMTaskLists', () => {
  let $element: JQuery;

  const markdown: [string] = [
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
      const html = $element.find('.rendered-markdown').html();
      console.log(html);
      done();
    });
  });

  it('disables task lists', (done) => {
    renderMarkdown(() => {
      $element.gfmTaskList({
        markdownContainer: '.markdown-editor',
        renderedContainer: '.rendered-markdown',
        onUpdate: (updatedMarkdown) => {}
      });

      $element.gfmTaskList('disable');

      const checkboxes = $element.find('.rendered-markdown .task-list-item-checkbox');
      checkboxes.each((key, value) => {
        $(value).attr('disabled').should.equal('disabled');
      });

      done();
    });
  });

  describe('clicking a rendered checkbox', () => {
    it('updates markdown when rendered checkbox is checked', (done) => {
      renderMarkdown(() => {
        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: (updatedMarkdown) => {}
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').eq(0);
        firstCheckbox.trigger('change')

        done();
      });
    });

    it('updates markdown when rendered checkbox is un-checked')

    it('updates correct checkbox when value is duplicated between items in same list')

    it('updates correct checkbox when value is duplicated between items in separate lists')
  });

  it('throws if instance is missing when calling gfmTaskList methods')

  it('throws if no object is passed to constructor')
});
