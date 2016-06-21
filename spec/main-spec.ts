import '../src/main';
import 'babel-polyfill';
import * as request from 'superagent';
import { should } from 'chai';

describe('GFMTaskLists', () => {
  let $element: JQuery;
  let sandbox: Sinon.SinonSandbox;

  const renderMarkdown = (markdown: Array<string>) : Promise<void> => {
    return new Promise<void>((resolve, reject) => {
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
            return reject(err);
          }

          $element.find('.rendered-markdown').html(res.text);
          return resolve();
        });
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

  it('enables task lists', () => {
    const markdown: Array<string> = [
      "- [ ] item 1",
      "- [ ] item 2"
    ];

    return renderMarkdown(markdown).then(() => {
      $element.gfmTaskList({
        markdownContainer: '.markdown-editor',
        renderedContainer: '.rendered-markdown',
        onUpdate: (updatedMarkdown) => {}
      });

      const checkboxes = $element.find('.rendered-markdown .task-list-item-checkbox');
      checkboxes.each((key, value) => {
        should().not.exist($(value).attr('disabled'));
      });
    });
  });

  it('disables task lists', () => {
    const markdown: Array<string> = [
      "- [ ] item 1",
      "- [ ] item 2"
    ];

    return renderMarkdown(markdown).then(() => {
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
    });
  });

  it('throws if instance is missing when calling gfmTaskList methods', () => {
    const fn = () => $element.gfmTaskList('enable');
    fn.should.throw('Must construct gfmTaskList before calling methods on it.');
  });

  describe('clicking a rendered checkbox', () => {
    it('updates markdown when rendered checkbox is checked', () => {
      const markdown: Array<string> = [
        "- [ ] item 1",
        "- [ ] item 2"
      ];
      const expectedMarkdown: Array<string> = [
        "- [x] item 1",
        "- [ ] item 2"
      ];
      const updateStub = sandbox.stub();

      return renderMarkdown(markdown).then(() => {
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
      });
    });

    it('updates markdown when rendered checkbox is un-checked', () => {
      const markdown: Array<string> = [
        "- [x] item 1",
        "- [ ] item 2"
      ];
      const expectedMarkdown: Array<string> = [
        "- [ ] item 1",
        "- [ ] item 2"
      ];

      const updateStub = sandbox.stub();

      return renderMarkdown(markdown).then(() => {
        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: updateStub
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').eq(0);
        firstCheckbox.prop('checked', false);
        firstCheckbox.trigger('change');

        updateStub.callCount.should.equal(1);
        updateStub.firstCall.args[0].should.equal(expectedMarkdown.join('\n'));
      });
    });

    it('updates correct checkbox when value is duplicated between items in same list', () => {
      const markdown: Array<string> = [
        "- [ ] item 1",
        "- [ ] item 1"
      ];
      const expectedMarkdown: Array<string> = [
        "- [ ] item 1",
        "- [x] item 1"
      ];

      const updateStub = sandbox.stub();

      return renderMarkdown(markdown).then(() => {
        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: updateStub
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').eq(1);
        firstCheckbox.prop('checked', true);
        firstCheckbox.trigger('change');

        updateStub.callCount.should.equal(1);
        updateStub.firstCall.args[0].should.equal(expectedMarkdown.join('\n'));
      });
    });

    it('updates correct checkbox when value is duplicated between items in separate lists', () => {
      const markdown: Array<string> = [
        "- [ ] item 1",
        "- [ ] item 1",
        " ",
        "Another List: ",
        "- [ ] item 1"
      ];
      const expectedMarkdown: Array<string> = [
        "- [ ] item 1",
        "- [ ] item 1",
        " ",
        "Another List: ",
        "- [x] item 1"
      ];

      const updateStub = sandbox.stub();

      return renderMarkdown(markdown).then(() => {
        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: updateStub
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').last();
        firstCheckbox.prop('checked', true);
        firstCheckbox.trigger('change');

        updateStub.callCount.should.equal(1);
        updateStub.firstCall.args[0].should.equal(expectedMarkdown.join('\n'));
      });
    });

    it('updates correct checkbox when value is nested', () => {
      const markdown: Array<string> = [
        "- [ ] item 1",
        "- [ ] item 1",
        "  - [ ] nested item"
      ];
      const expectedMarkdown: Array<string> = [
        "- [ ] item 1",
        "- [ ] item 1",
        "  - [x] nested item"
      ];

      const updateStub = sandbox.stub();

      return renderMarkdown(markdown).then(() => {
        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: updateStub
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').last();
        firstCheckbox.prop('checked', true);
        firstCheckbox.trigger('change');

        updateStub.callCount.should.equal(1);
        updateStub.firstCall.args[0].should.equal(expectedMarkdown.join('\n'));
      });
    });

    it('emits "tasklist:change" event when checkbox is clicked but before markdown-editor is updated', () => {
      const markdown: Array<string> = [
        "- [ ] item 1",
      ];
      const listenerStub: Sinon.SinonStub = sandbox.stub();

      $element.on('tasklist:change', (...args) => {
        $element.find('.markdown-editor').val().should.equal(markdown.join('\n'));
        listenerStub.apply(null, args);
      });

      return renderMarkdown(markdown).then(() => {
        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: (markdown: string) => {}
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').first();
        firstCheckbox.prop('checked', true);
        firstCheckbox.trigger('change');

        listenerStub.callCount.should.equal(1);
        listenerStub.firstCall.args[1].should.equal(1);
        listenerStub.firstCall.args[2].should.equal(true);
      });
    });

    it('should emit "tasklist:changed" after markdown editor value is updated', () => {
      const markdown: Array<string> = [
        "- [ ] item 1",
      ];
      const expectedMarkdown: Array<string> = [
        "- [x] item 1",
      ];
      const listenerStub: Sinon.SinonStub = sandbox.stub();

      $element.on('tasklist:changed', (...args) => {
        $element.find('.markdown-editor').val().should.equal(expectedMarkdown.join('\n'));
        listenerStub.apply(null, args);
      });

      return renderMarkdown(markdown).then(() => {
        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: (markdown: string) => {}
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').first();
        firstCheckbox.prop('checked', true);
        firstCheckbox.trigger('change');

        listenerStub.callCount.should.equal(1);
        listenerStub.firstCall.args[1].should.equal(1);
        listenerStub.firstCall.args[2].should.equal(true);
      });
    });

    it('does not emit "tasklist:changed" event when event has "preventDefault()" called on it', () => {
      const markdown: Array<string> = [
        "- [ ] item 1",
      ];
      const listenerStub: Sinon.SinonStub = sandbox.stub();

      $element.on('tasklist:change', (event) => {
        event.preventDefault();
      });
      $element.on('tasklist:changed', listenerStub);

      return renderMarkdown(markdown).then(() => {
        $element.gfmTaskList({
          markdownContainer: '.markdown-editor',
          renderedContainer: '.rendered-markdown',
          onUpdate: (markdown: string) => {}
        });

        const firstCheckbox = $element.find('.rendered-markdown .task-list-item-checkbox').first();
        firstCheckbox.prop('checked', true);
        firstCheckbox.trigger('change');

        listenerStub.callCount.should.equal(0);
        $element.find('.markdown-editor').val().should.equal(markdown.join('\n'));
      });
    });
  });
});
