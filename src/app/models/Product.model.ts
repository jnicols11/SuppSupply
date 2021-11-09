export class Product {
  public ID: Number;
  public name: String;
  public description: String;
  public price: Number;
  public quantity: Number;
  public image: String;

  constructor(ID: Number, name: String, description: String, price: Number, quantity: Number, image: String) {
    this.ID = ID;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.image = image;
  }
}
