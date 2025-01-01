import { CrudService } from "../crudService";
import bcrypt from "bcrypt";
import { Client } from "@/app/lib/backend/models/client.model";

class ClientService extends CrudService<any> {
  constructor() {
    super(Client);
  }

  generateClientSystemID(): string {
    const prefix = "CLI"; // Client prefix
    const year = new Date().getFullYear().toString().slice(-2); // Last two digits of the year
  
    // Generate a random 4-character alphanumeric string
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  
    // Combine parts to create the client ID
    return `${prefix}-${year}${randomPart}`;
  }
}

export { ClientService };
