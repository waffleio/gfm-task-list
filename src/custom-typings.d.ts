declare const GH_ACCESS_TOKEN:string;

interface GFMTaskListSettings {
  markdownContainer: string|JQuery;
  renderedContainer: string|JQuery;
  onUpdate(markdown:string) : void;
}

interface GFMTaskListElements {
  $container: JQuery;
  $markdownContainer: JQuery;
  $renderedContainer: JQuery;
}

interface JQuery {
  gfmTaskList(action:string|GFMTaskListSettings): JQuery;
}
