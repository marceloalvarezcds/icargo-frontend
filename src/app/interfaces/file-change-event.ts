export interface FileEventTarget extends EventTarget {
  files?: FileList;
}

export interface FileChangeEvent extends Event {
  target: FileEventTarget | null;
}
