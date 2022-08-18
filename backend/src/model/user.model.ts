
export abstract class User {
    customerID: string;
    id: string;
    userName: string;
   
    constructor(customerID: string, userName: string) {
      this.customerID = customerID;
      this.id = customerID;
      this.userName = userName;
    }

    abstract getData():Object;
  }