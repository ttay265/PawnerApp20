sap.ui.define([
	'pawner/app/controller/BaseController',
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("pawner.app.controller.LoginAndRegister", {
		onInit: function(){
			
		},
		
		navToRegister: function() {
			this.getRouter().navTo("registerPage");
		},
		
		navToLogin: function() {
			this.getRouter().navTo("loginPage");
		}
	});

});
