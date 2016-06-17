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

  const updateTaskList = ($item:JQuery) : void => {
    const index = 1 + $container.find('.task-list-item-checkbox').index($item);
    const checked = $item.prop('checked');
    const event = $.Event('tasklist:change');
    const updatedMarkdown = updateTaskListItem($markdownContainer.val(), index, checked);

    $markdownContainer.trigger(event, [index, checked]);

    if (!event.isDefaultPrevented()) {
      $markdownContainer.val(updatedMarkdown);
      $markdownContainer.trigger('change');
      $markdownContainer.trigger('tasklist:changed', [index, checked]);
    }
  };

  const enableTaskLists = () : void => {
    $renderedContainer
      .find('.task-list-item').addClass('enabled')
      .find('.task-list-item-checkbox').attr('disabled', null);

    $container.trigger('tasklist:enabled');
  }

  $.fn.gfmTaskList = function (settings:GFMTaskListSettings) : JQuery {
    $container = this;
    $markdownContainer = $(settings.markdownContainer);
    $renderedContainer = $(settings.renderedContainer);
    const onUpdate = settings.onUpdate;

    enableTaskLists();

    $renderedContainer.on('change', '.task-list-item-checkbox', (event) => {
      debugger;
      updateTaskList($(event.target));
    });

    return this;
  }
}
