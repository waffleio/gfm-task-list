import '../src/main';
import * as request from 'superagent';
import { should } from 'chai';

describe('GFMTaskLists', () => {
  let $element: JQuery;
  let sandbox: Sinon.SinonSandbox;

  const markdown: [string] = [
    "- [ ] item 1",
    "- [ ] item 2",
    "  - [ ] nested 1",
    "    - [ ] super nested 1"
  ];

  const renderMarkdown = (cb) : void => {
    $element.find('.markdown-editor').val(markdown.join('\n'));

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
          return cb(err, res);
        }

        $element.find('.rendered-markdown').html(res.text);
        cb()
      });
  };

  before(() => {
    sandbox = sinon.sandbox.create();
  });

  beforeEach(() => {
    $element = $([
      '<div class="container">',
      '  <textarea class="markdown-editor"></textarea>',
      '  <div class="rendered-markdown"></div>',
      '</div>'
    ].join('\n'))
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('enables task lists', (done) => {
    renderMarkdown((err) => {
      if (err) return done(err);

      $element.gfmTaskList({
        markdownContainer: '.markdown-editor',
        renderedContainer: '.rendered-markdown',
        onUpdate: (updatedMarkdown) => {}
      });

      const checkboxes = $element.find('.rendered-markdown .task-list-item-checkbox');
      checkboxes.each((key, value) => {
        should().not.exist($(value).attr('disabled'));
      });

      done();
    });
  });

  it('disables task lists', (done) => {
    renderMarkdown((err) => {
      if (err) return done(err);

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
      const updateStub = sandbox.stub();
      const expectedMarkdown = [];
      expectedMarkdown.push(...markdown);
      expectedMarkdown[0] = "- [x] item 1"

      renderMarkdown((err) => {
        if (err) return done(err);

        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: updateStub
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').eq(0);
        firstCheckbox.prop('checked', true);
        firstCheckbox.trigger('change');

        updateStub.callCount.should.equal(1);
        updateStub.firstCall.args[0].should.equal(expectedMarkdown.join('\n'));

        done();
      });
    });

    it('updates markdown when rendered checkbox is un-checked')

    it('updates correct checkbox when value is duplicated between items in same list')

    it('updates correct checkbox when value is duplicated between items in separate lists')

    it('updates correct checkbox when value is nested')

    it('emits "tasklist:change" event when checkbox is clicked')

    it('does not emit "tasklist:changed" event when event has "preventDefault()" called on it')

    it('does not update markdown when event has "preventDefault()" called on it')
  });

  it('throws if instance is missing when calling gfmTaskList methods')

  it('throws if no object is passed to constructor')
});
