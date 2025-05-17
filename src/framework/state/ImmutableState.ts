export class ImmutableState {
  private readonly data: Record<string, string>;

  constructor(data: Record<string, string>) {
    this.data = data;
  }

  getValue(key: string): string {
    return this.data[key] ?? "";
  }
}
