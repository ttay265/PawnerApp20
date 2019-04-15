sap.ui.define([
	'pawner/app/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	"pawner/app/model/formatter",
	'pawner/app/model/models'
], function(BaseController, JSONModel, formatter, models) {
	"use strict";

	return BaseController.extend("pawner.app.controller.NotificationDetail", {

		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf pawner.app.view.Search
		 */
		onInit: function() {
			var oRouter = this.getRouter();

			oRouter.getRoute("notificationDetail").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var objId = oEvent.getParameter("arguments").objId;
			var userId = this.getGlobalModel().getProperty("/accountId");
			setInterval(this.getCountNoti(userId), 600000);

			this.getNotiDetail(objId);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf pawner.app.view.Search
		 */

		getNotiDetail: function(objId) {
			var getData = models.getNotiDetail(objId);
			var oModelNoti = new JSONModel();
			if(getData) {
				oModelNoti.setData(getData);
			}
			this.setModel(oModelNoti, "oModelNoti");
		},

		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf pawner.app.view.Search
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf pawner.app.view.Search
		 */
		onExit: function() {

		}

	});

});