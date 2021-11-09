export class User {
  public ID: Number;
  public firstName: String;
  public lastName: String;
  public email: String;
  public password: String;

  constructor(ID: Number, firstName: String, lastName: String, email: String, password?: String) {
    this.ID = ID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}
