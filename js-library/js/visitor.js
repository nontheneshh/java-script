class Visitor {
  constructor(id, name, phone) {
    this.id = id;
    this.name = name;
    this.phone = phone;
  }
  change(name, phone) {
    this.name = name;
    this.phone = phone;
  }
}
