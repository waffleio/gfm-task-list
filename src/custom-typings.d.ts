declare const GH_ACCESS_TOKEN:string;

interface gfmSettings {
  markdownContainer: string;
  renderedContainer: string;
}

interface JQuery {
    gfmTaskList(): JQuery;
    gfmTaskList(settings:gfmSettings): JQuery;
}
