export class AuthRequiredError extends Error {
	constructor(message = "An unknown error occurred"){
		super(message);
		this.name = "Error"
	}
}