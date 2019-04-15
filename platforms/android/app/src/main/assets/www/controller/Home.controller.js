sap.ui.define([
	'pawner/app/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'pawner/app/model/models',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, models, MessageBox) {
	"use strict";

	return BaseController.extend("pawner.app.controller.Home", {
		onInit: function() {
			this.openLocationSystem();
			var lat = this.getGlobalModel().getProperty("/lat");
			var lng = this.getGlobalModel().getProperty("/lng");
			this.getBestShop(lat, lng);
			this.getBestSaleItem(lat, lng);
		},

		getBestShop: function(lat, lng) {
			var getData = models.getBestShop(lat, lng);
			if (getData) {
				var oModelShop = new JSONModel();
				oModelShop.setData({
					results: getData
				});
				this.setModel(oModelShop, "oModelShop");
			}
			var userId = this.getGlobalModel().getProperty("/accountId");
			setInterval(this.getCountNoti(userId), 600000);
		},

		getBestSaleItem: function(lat, lng) {
			var getData = models.getBestSaleItem(lat, lng);
			if(getData) {
				var oModelShop = new JSONModel();
				oModelShop.setData({
					results: getData
				});
				this.setModel(oModelShop, "oModelSaleItem");
				console.log(oModelShop) ;
			}
		},

		navToShopDetail: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelShop");
			if (bindingContext) {
				var shopId = bindingContext.getProperty("id");
				this.getRouter().navTo("shopDetail", {
					shopId: shopId
				}, false);
			}
		},
		
		navToSaleItem: function() {
			this.getRouter().navTo("searchFilterItem");
			// this.getRouter().navTo("activate", {
			// 	token: 123
			// });
		},
		
		selectSaleItem: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelSaleItem");
			if (bindingContext) {
				var itemId = bindingContext.getProperty("id");
				this.getRouter().navTo("itemDetail", {
					itemId: itemId
				}, false);
			}
		},
		
		navToRegisterShop: function() {
			var isLogging = localStorage.getItem("isLogging");
			if(isLogging === "true") {
				this.getRouter().navTo("registerShop");
			} else {
				MessageBox.error("Bạn cần Đăng nhập để tiếp tục Đăng kí trở thành Chủ Shop trong hệ thống!");
			}
		}
	});

});