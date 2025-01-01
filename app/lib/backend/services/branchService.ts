import { CrudService } from "../crudService";
import bcrypt from "bcrypt";
import { Branch } from "@/app/lib/backend/models/branch.model";

class BranchService extends CrudService<any> {
  private sequenceCounter: number;
  constructor(initialCounter: number = 0) {
    super(Branch);
    this.sequenceCounter = initialCounter;
  }

  generateBranchCode(branchName: string): string {
    // Increment the sequence counter for each new branch
    this.sequenceCounter++;

    // Extract the first three characters of the branch name in uppercase
    const branchPrefix = branchName.slice(0, 3).toUpperCase();

    // Pad the sequence number to ensure it is at least two digits
    const paddedSequence = this.sequenceCounter.toString().padStart(2, "0");

    // Combine the prefix and sequence number
    return `${branchPrefix}${paddedSequence}`;
  }
}

export { BranchService };
