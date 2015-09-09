var facebookModule = angular.module("FacebookModule", []);
facebookModule.controller("FacebookService", initFacebookService);

function initFacebookService()
{
	console.log("initFacebookService");
	var testFacebookVar = "testFacebookVar";

	return{
		testFacebookVar: testFacebookVar
	}
}