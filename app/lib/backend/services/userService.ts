import { CrudService } from "../crudService";
import bcrypt from "bcrypt";
import {User} from "@/app/lib/backend/models/user.model"


class UserService extends CrudService<any> {
  constructor() {
    // Passing the collection name directly to the CrudService constructor
    super(User);
  }

  // Additional methods specific to movies can be added here
  // async findMoviesByDirector(director: string): Promise<Movie[]> {
  //     return this.collection.find({ director }).toArray();
  // }

  validateString(str: string, value: string): string {
    const regex = /^[a-zA-Z\s'-]+$/;
    if (str.trim() && !regex.test(str.trim()))
      return `${value.toLowerCase()} must be a valid name`;
    return "";
  }

  generateSecurePassword(length: number = 12): string {
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const allCharacters =
      upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;
    let password = "";

    // Ensure the password contains at least one character from each category
    password +=
      upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    password +=
      lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

    // Fill the rest of the password length with random characters
    for (let i = password.length; i < length; i++) {
      password +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    // Shuffle the password to ensure random order of characters
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return password;
  }

  async generateHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateUsername(
    firstName: string,
    lastName: string,
    otherNames?: string
  ): string {
    // Extract the first letter of the firstName and otherNames
    const firstInitial = firstName.charAt(0).toLowerCase();
    const otherInitial = otherNames ? otherNames.charAt(0).toLowerCase() : "";

    // Combine the initials and last name
    const baseUsername = `${firstInitial}${otherInitial}${lastName.toLowerCase()}`;

    // Append a random number (100–999) for uniqueness
    const randomNumber = Math.floor(100 + Math.random() * 900);

    // Construct the final username
    return `${baseUsername}${randomNumber}`;
  }
}

export { UserService };
