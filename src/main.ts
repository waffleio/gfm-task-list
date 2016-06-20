import './main.scss';

class GFMTaskList {
  static name:string;
  incomplete:string = "[ ]";
  complete:string = "[x]";

  incompletePattern:RegExp = RegExp(this.escapePattern(this.incomplete));
  completePattern:RegExp = RegExp(this.escapePattern(this.complete));
  itemPattern:RegExp = RegExp(`^(?:\\s*[-+*]|(?:\\d+\\.))?\\s*(${this.escapePattern(this.complete)}|${this.escapePattern(this.incomplete)})(?=\\s)`);
  codeFencesPattern:RegExp = /^`{3}(?:\s*\w+)?[\S\s].*[\S\s]^`{3}$/mg;
  itemsInParasPattern:RegExp = RegExp(`^(${this.escapePattern(this.complete)}|${this.escapePattern(this.incomplete)}).+$`, 'g');

  $element:JQuery;
  $markdownContainer:JQuery;
  $renderedContainer:JQuery;
  onUpdate:any;

  constructor ($element:JQuery, settings:GFMTaskListSettings) {
    this.$element = $element;
    this.$markdownContainer = this.$element.find(<JQuery>settings.markdownContainer);
    this.$renderedContainer = this.$element.find(<JQuery>settings.renderedContainer);

    this.onUpdate = (event:JQueryEventObject) => {
      const update:string = this.updateTaskList($(event.target));
      if (update) settings.onUpdate(update);
    };

    this.$renderedContainer.on('change', '.task-list-item-checkbox', this.onUpdate);

    this.enable()
  }

  public destroy () : void {
    this.$renderedContainer.off('change', '.task-list-item-checkbox', this.onUpdate);
  }

  public enable () : void {
    this.$renderedContainer
      .find('.task-list-item').addClass('enabled')
      .find('.task-list-item-checkbox').attr('disabled', null);

    this.$element.trigger('tasklist:enabled');
  }

  public disable () : void {
    this.$renderedContainer
      .find('.task-list-item').removeClass('enabled')
      .find('.task-list-item-checkbox').attr('disabled', 'disabled');

    this.$element.trigger('tasklist:disabled');
  }

  private updateTaskListItem (source:string, itemIndex:number, checked:boolean) : string {
    const clean:string[] = source
      .replace(/\r/g, '')
      .replace(this.codeFencesPattern, '')
      .replace(this.itemsInParasPattern, '')
      .split("\n");

    let index:number = 0;
    const updatedMarkdown = [];
    for (let line of source.split('\n')) {
      if (clean.indexOf(line) >= 0 && this.itemPattern.test(line)) {
        index++;
        if (index === itemIndex) {
          if (checked) {
            line = line.replace(this.incompletePattern, this.complete);
          } else {
            line = line.replace(this.completePattern, this.incomplete);
          }
        }
      }
      updatedMarkdown.push(line);
    }

    return updatedMarkdown.join('\n');
  };

  private updateTaskList ($item : JQuery) : string {
    const index = 1 + this.$renderedContainer.find('.task-list-item-checkbox').index($item);
    const checked = $item.prop('checked');
    const event = $.Event('tasklist:change');

    this.$element.trigger(event, [index, checked]);

    if (event.isDefaultPrevented()) return;

    const updatedMarkdown = this.updateTaskListItem(this.$markdownContainer.val(), index, checked);

    this.$markdownContainer.val(updatedMarkdown);
    this.$markdownContainer.trigger('change');
    this.$markdownContainer.trigger('tasklist:changed', [index, checked]);
    return updatedMarkdown;
  };

  private escapePattern (str) {
    return str
      .replace(/([\[\]])/g, '\\$1')
      .replace(/\s/, '\\s')
      .replace('x', '[xX]');
  }
}

namespace jQuery {
  $.fn.gfmTaskList = function (action:string|GFMTaskListSettings) : JQuery {
    let instance = $.data(this, GFMTaskList.name);

    if (typeof action === 'string') {
      if (!instance) {
        throw new Error("Must construct gfmTaskList before calling methods on it.");
      }

      instance[action]();
      return this;
    }

    let settings:GFMTaskListSettings;
    if (typeof action === 'object') {
      settings = <GFMTaskListSettings>action;
      action = undefined;
    } else {
      throw new Error("Must pass an object to $.fn.gfmTaskList().");
    }

    if (instance) instance.destroy();

    instance = $.data(this, GFMTaskList.name, new GFMTaskList(this, settings));

    return this;
  }
}
