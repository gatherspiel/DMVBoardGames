import { addReadOnlyStore } from "./ComponentStore.ts";

export class ReadOnlyStore {
  private readonly data: Record<string, string>;

  constructor(data: Record<string, string>) {
    this.data = data;
    addReadOnlyStore(this);
  }

  getValue(key: string): string {
    return this.data[key] ?? "";
  }
}
