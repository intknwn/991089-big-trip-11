export default class Destination {
  constructor(data) {
    this.description = data[`description`];
    this.name = data[`name`];
    this.images = data[`pictures`];
  }

  toRAW() {
    return {
      'description': this.description,
      'name': this.name,
      'pictures': this.images
    };
  }

  static parse(data) {
    return new Destination(data);
  }

  static parseAll(data) {
    return data.map(Destination.parse);
  }
}
