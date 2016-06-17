import './main.scss';

namespace JQuery {
  let $container: JQuery;
  let $markdownContainer: JQuery;
  let $renderedContainer: JQuery;

  const incomplete = "[ ]";
  const complete = "[x]";

  const escapePattern = function(str) {
    return str
      .replace(/([\[\]])/g, '\\$1')
      .replace(/\s/, '\\s')
      .replace('x', '[xX]');
  };

  const incompletePattern = RegExp(escapePattern(incomplete));
  const completePattern = RegExp(escapePattern(complete));
  const itemPattern = RegExp(`^(?:\\s*[-+*]|(?:\\d+\\.))?\\s*(${escapePattern(complete)}|${escapePattern(incomplete)})(?=\\s)`);
  const codeFencesPattern = /^`{3}(?:\s*\w+)?[\S\s].*[\S\s]^`{3}$/mg;
  const itemsInParasPattern = RegExp(`^(${escapePattern(complete)}|${escapePattern(incomplete)}).+$`, 'g');

  const updateTaskListItem = (source:string, itemIndex:number, checked:boolean) : string => {
    const clean:string[] = source
      .replace(/\r/g, '')
      .replace(codeFencesPattern, '')
      .replace(itemsInParasPattern, '')
      .split("\n");

    let index:number = 0;
    const updatedMarkdown = [];
    for (let line of source.split('\n')) {
      if (clean.indexOf(line) >= 0 && itemPattern.test(line)) {
        index++;
        if (index === itemIndex) {
          if (checked) {
            line = line.replace(incompletePattern, complete);
          } else {
            line = line.replace(completePattern, incomplete);
          }
        }
      }
      updatedMarkdown.push(line);
    }

    return updatedMarkdown.join('\n');
  };

  const updateTaskList = ($item:JQuery) : string => {
    const index = 1 + $container.find('.task-list-item-checkbox').index($item);
    const checked = $item.prop('checked');
    const event = $.Event('tasklist:change');

    $markdownContainer.trigger(event, [index, checked]);

    const updatedMarkdown = updateTaskListItem($markdownContainer.val(), index, checked);

    if (event.isDefaultPrevented()) return;

    $markdownContainer.val(updatedMarkdown);
    $markdownContainer.trigger('change');
    $markdownContainer.trigger('tasklist:changed', [index, checked]);
    return updatedMarkdown;
  };

  const enableTaskLists = () : void => {
    $renderedContainer
      .find('.task-list-item').addClass('enabled')
      .find('.task-list-item-checkbox').attr('disabled', null);

    $renderedContainer.find('.task-list-item').prepend(`
      <span class="handle">
        <svg class="drag-handle" aria-hidden="true" width="16" height="15" version="1.1" viewBox="0 0 16 15">
          <path d="M12,4V5H4V4h8ZM4,8h8V7H4V8Zm0,3h8V10H4v1Z"></path>
        </svg>
      </span>
    `);

    $('.task-list-item').hover(
      (event) => $(event.target).find('.handle').addClass('hovered'),
      (event) => $(event.target).find('.handle').removeClass('hovered')
    );

    $container.trigger('tasklist:enabled');
  }

  $.fn.gfmTaskList = function (settings:GFMTaskListSettings) : JQuery {
    $container = this;
    $markdownContainer = $(settings.markdownContainer);
    $renderedContainer = $(settings.renderedContainer);
    const onUpdate = settings.onUpdate;

    enableTaskLists();

    $renderedContainer.on('change', '.task-list-item-checkbox', (event) => {
      const update = updateTaskList($(event.target));
      if (update) onUpdate(update);
    });

    return this;
  }
}
