import { CrudService } from "../crudService";
import {LoanApplication} from "@/app/lib/backend/models/loans.model";


class LoanService extends CrudService<any> {
  constructor() {
    super(LoanApplication);
  }
}

export { LoanService };
