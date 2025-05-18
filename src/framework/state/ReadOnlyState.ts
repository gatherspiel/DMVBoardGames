import { addReadOnlyState } from "./ComponentStateManager.ts";

export class ReadOnlyState {
  private readonly data: Record<string, string>;

  constructor(data: Record<string, string>) {
    this.data = data;
    addReadOnlyState(this);
  }

  getValue(key: string): string {
    return this.data[key] ?? "";
  }
}
