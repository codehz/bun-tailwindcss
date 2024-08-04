export type MessageType =
  | { type: "class"; prefix: string; contents: string[] }
  | { type: "candidates"; contents: string[] };
