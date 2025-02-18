import { CrudService } from "../crudService";
import { Activitymanagement } from "../models/activitymanagement.model";
import mongoose from "mongoose";


class ActivitymanagementService extends CrudService<any> {

	private crudServcie: CrudService<any>;
	constructor() {
		super(Activitymanagement)
		this.crudServcie = new CrudService(Activitymanagement);
	}


	async createActivity(activity: string, user: mongoose.Types.ObjectId) {
		await this.crudServcie.create({ user, activity });
	}
}

export {ActivitymanagementService}