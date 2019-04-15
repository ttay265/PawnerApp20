sap.ui.define([
	'pawner/app/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'pawner/app/model/models'
], function(BaseController, JSONModel, models) {
	"use strict";

	return BaseController.extend("pawner.app.controller.ResultSearchItem", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf pawner.app.view.Search
		 */
		onInit: function() {
			var oRouter = this.getRouter();

			oRouter.getRoute("resultSearchItem").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var query = oEvent.getParameter("arguments").query;

			this.getItemByQuery(query);
			var userId = this.getGlobalModel().getProperty("/accountId");
			setInterval(this.getCountNoti(userId), 600000);
		},

		getItemByQuery: function(query) {
			var data = models.searchItemByKeyword(query);
			if(data){
				var oModelItem = new JSONModel();
				oModelItem.setData({
					results: data
				});
				this.setModel(oModelItem, "oModelItem");
			}
		},

		navToItemDetail: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelItem");
			if (bindingContext) {
				var itemId = bindingContext.getProperty("id");
				this.getRouter().navTo("itemDetail", {
					itemId: itemId
				}, false);
			}
		},

		onSearch: function(oEvent) {
			var value = oEvent.getParameter("query");
			if (value) {
				this.getShopByQuery(value);
			}
			var getValue = this.byId("field_search");
			// console.log(getValue);
			getValue.setProperty("value", "");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf pawner.app.view.Search
		 */
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