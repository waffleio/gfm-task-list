import './main.scss';

$.fn.gfmTaskList = function(settings:gfmSettings) {
  const {markdownContainer, renderedContainer} = settings;

  if (this.find('.contains-task-list').length === 0) return;

  $(renderedContainer).find('.task-list-item-checkbox').attr('disabled', null).change( (event) => {
    const checkbox = $(event.target);
    const taskTitle = checkbox.parent().text().replace(/\n /g,'');

    debugger
    if (checkbox.is(':checked')) {
      var currentTask = `- [ ] ${taskTitle}`
      var updatedTask = `- [x] ${taskTitle}`
    } else {
      var currentTask = `- [x] ${taskTitle}`
      var updatedTask = `- [ ] ${taskTitle}`
    }

    const updatedMarkdown = $(markdownContainer).val().replace(currentTask, updatedTask);
    $(markdownContainer).val(updatedMarkdown);
  });
}
