# gfm-task-list
> This plugin is based on the work previously done on [github-archive/task_list](https://github.com/github-archive/task_list). That plugin has been deprecated and this plugin picks up where it left off.

[![Build Status](https://travis-ci.org/waffleio/gfm-task-list.svg?branch=master)](https://travis-ci.org/waffleio/gfm-task-list)
[![Open Issues](https://badge.waffle.io/waffleio/gfm-task-list.svg?label=waffle%3Ain%20progress&title=In%20Progress)](https://waffle.io/waffleio/waffle.io?source=waffleio%2Fgfm-task-list)

jQuery plugin for enabling [GitHub Flavored Markdown (GFM) task lists](https://github.com/blog/1375-task-lists-in-gfm-issues-pulls-comments) for third-party integrations to GitHub.

## Getting Started
### Installation
You can find the built library in [npmcdn](https://npmcdn.com). You may either download them and serve them from your app or load them directly from npmcdn.
#### npmcdn
```html
<link rel="stylesheet" type="text/css" href="https://npmcdn.com/gfm-task-list@1.0.0/dist/gfm-task-list.min.css"></link>
<script src="https://npmcdn.com/gfm-task-list@1.0.0/dist/gfm-task-list.min.js"></script>
```

### Usage
#### HTML Structure
`gfmTaskList` expects your html to have a structure similar to:
```html
<div class="container">
  <textarea class="markdown-editor"></textarea>
  <div class="rendered-markdown"></div>
</div>
```
You are responsible for populating `.markdown-editor` with the markdown of the issue or comment body as well as for populating `.rendered-markdown` with the rendered html for that markdown.

#### Initialization
`gfmTaskList` is written as a jQuery plugin. To initialize a task list, you must specify which element contains the raw markdown and which element contains the rendered html. For example:
```javascript
$('.container').gfmTaskList({
  markdownContainer: '.markdown-editor',
  renderedContainer: '.rendered-markdown'
});
```
Once initialized, the task list check boxes will be enabled and any change in the state of the checkboxes within the rendered container will be reflected in the markdown in the markdown container.
#### Handling Task List Updates
You can handle updates by either passing an `onUpdate` callback at the time of initialization:
```javascript
$('.container').gfmTaskList({
  markdownContainer: '.markdown-editor',
  renderedContainer: '.rendered-markdown',
  onUpdate: function(updatedMarkdown) {
    // Handle the update, generally involves sending a PATCH request to GitHub to update the issue/comment.
  }
});
```
or by listening for the plugin's jQuery events:
```javascript
$('.container').on('tasklist:changed', function(event, index, checked) {
  var updatedMarkdown = $('.markdown-editor').val();
  // PATCH request to GitHub to update the issue/comment.
});
```

#### Methods
After initializing a task list, you may `enable` or `disable` the list.

*Note:* The task list will automatically be enabled after initialization.
##### Enable
```javascript
$('.container').gfmTaskList('enable');
```
##### Disable
```javascript
$('.container').gfmTaskList('enable');
```

#### Events
All events are fired from the element used to initialize `gfmTaskList`.
##### tasklist:enabled
Fired when a task list has been enabled. Ex:
```javascript
$('.container').on('tasklist:enabled', function(event) {});
```
##### tasklist:disabled
Fired when a task list has been disabled. Ex:
```javascript
$('.container').on('tasklist:disabled', function(event) {});
```
##### tasklist:change
Fired when a checkbox has been checked/unchecked, but before the associated markdown has been updated. You may call `event.preventDefault()` within this event handler to stop the markdown from being updated. Ex:
```javascript
$('.container').on('tasklist:change', function(event) {
  // event.preventDefault()
});
```
##### tasklist:changed
Fired after a checkbox has been checked/unchecked and the associated markdown has been updated. At this point, you are ready to send a PATCH request to GitHub to update the issue/comment.
```javascript
$('.container').on('tasklist:changed', function(event) {});
```

### Development
Please review our [contributing guidelines](https://github.com/waffleio/gfm-task-list/blob/master/CONTRIBUTING.md) for instructions on how to get started with contributing to this project.
