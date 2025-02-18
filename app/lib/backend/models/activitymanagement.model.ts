import mongoose, { Document, Schema } from "mongoose";

export interface IActivitymanagement extends Document {

	user: mongoose.Types.ObjectId;
	activity: string;
};


export const ActivitymanagementSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},

	activity: {
		type: String,
		required: true
	}
},
	{
		timestamps: true
	}
)

if (mongoose.models.Activitymanagement) {
	// Delete the existing model to allow redefinition
	delete mongoose.models.Activitymanagement;
}


export const Activitymanagement = mongoose.model<IActivitymanagement>('Activitymanagement', ActivitymanagementSchema);