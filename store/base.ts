export interface StoredObject {
  readonly id: string;
}

export class Store<Object extends StoredObject> {
  objects: Object[] = [];
  delete(id: string): void {
    this.objects = this.objects.filter((object: Object) => object.id !== id);
  }
  get(id: string): Object | undefined {
    return this.objects.find((object: Object) => object.id === id);
  }
  getAll(): ReadonlyArray<Object> {
    return this.objects;
  }
  put(object: Object): Object {
    this.delete(object.id);
    this.objects = this.objects.concat([object]);
    return object;
  }
}
