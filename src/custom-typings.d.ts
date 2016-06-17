declare const GH_ACCESS_TOKEN:string;

interface GFMTaskListSettings {
  markdownContainer: string | JQuery;
  renderedContainer: string | JQuery;
  onUpdate(markdown:string) : void;
}

interface JQuery {
  gfmTaskList(settings:GFMTaskListSettings): JQuery;
}
