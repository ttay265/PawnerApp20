sap.ui.define([
	'pawner/app/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'pawner/app/model/models',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, models, MessageBox) {
	"use strict";
	var gMap, markers;
	return BaseController.extend("pawner.app.controller.RegisterShop", {
		onInit: function() {
			var oRouter = this.getRouter();
			this.checkRegister = true;
			var oModel = new sap.ui.model.json.JSONModel();
			this.setModel(oModel, "dataCity");

			var emailUser = localStorage.getItem("username");
			var modelRegister = new JSONModel({
				email: emailUser,
				shopName: "",
				phone: "",
				district: "",
				address: "",
				lat: "",
				lng: ""
			});
			this.setModel(modelRegister, "modelRegister");

			this.getView().byId("map_canvas").addStyleClass("myMap");

			oRouter.getRoute("registerShop").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			this.getDataCity();
			var that = this;

			/**************************************/
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var lat = position.coords.latitude,
						lng = position.coords.longitude;

					that.getModel("modelRegister").setProperty("/lat", lat);
					that.getModel("modelRegister").setProperty("/lng", lng);
					that.setLocation(lat, lng);
				}, function() {
					MessageBox.error("Bạn từ chối chia sẻ vị trí. Hãy bật nó lên để sử dụng chức năng này hoặc sử dụng các công cụ tìm kiếm khác.");
				});
			} else {
				// Browser doesn't support Geolocation
				MessageBox.error("Trình duyệt của bạn không hỗ trợ Geolocation");
			}
			var userId = this.getGlobalModel().getProperty("/accountId");
			setInterval(this.getCountNoti(userId), 600000);
		},

		validatePhone: function() {
			var getId = this.getView().byId("ip_phone");
			var getValue = getId.getValue();

			var phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

			if (!phoneRegex.test(getValue)) {
				getId.setValueState(sap.ui.core.ValueState.Error);
				this.checkRegister = false;
			} else {
				getId.setValueState(sap.ui.core.ValueState.Success);
			}
		},

		handleUserInput: function(oEvent) {
			var check = false;
			var sUserInput = oEvent.getParameter("value");
			var oInputControl = oEvent.getSource();
			if (!sUserInput || sUserInput == "") {
				oInputControl.setValueState(sap.ui.core.ValueState.Error);
				this.checkRegister = false;
			} else {
				oInputControl.setValueState(sap.ui.core.ValueState.Success);
				check = true;
			}
			return check;
		},

		registerShop: function() {
			//set busy
			var modelResiter = this.getModel("modelRegister");
			modelResiter.setProperty("/isPressing", true);

			var email = this.getView().byId("emailRegister").getProperty("value");
			var shopName = this.getView().byId("ip_shopname").getProperty("value");
			var phone = this.getView().byId("ip_phone").getProperty("value");
			var keyDistrict = this.getView().byId("filterDistrict").getSelectedKey();
			var address = this.getView().byId("ip_address").getProperty("value");
			var lat = this.getModel("modelRegister").getProperty("/lat");
			var lng = this.getModel("modelRegister").getProperty("/lng");
			var accountId = localStorage.getItem("uid");

			if (this.checkRegister == true) {
				if (lat === "" && lng === "") {
					MessageBox.error("Kéo Marker để có vị trí chính xác của Cửa hàng!");
				} else {
					var registerData = {
						accountId: accountId,
						shopName: shopName,
						email: email,
						phoneNumber: phone,
						districtId: keyDistrict,
						address: address,
						longtitude: lng,
						latitude: lat
					};
					var callback = models.registerShop(registerData);
					if (callback == "success") {
						MessageBox.success("Gửi đăng ký thành công! Hệ thống sẽ duyệt Cửa hàng của bạn!");
					} else if (callback.status === 406) {
						MessageBox.error("Tài khoản này đã được đăng ký thành chủ tiệm");
					} else {
						MessageBox.error("Đăng kí thất bại!");
					}
					modelResiter.setProperty("/isPressing", false);
				}
			} else {
				MessageBox.error("Kiểm tra lại thông tin!");
				modelResiter.setProperty("/isPressing", false);
			}
		},

		clearMarker: function() {
			markers.setMap(null);
		},

		getLocationFromInput: function() {
			this.clearMarker();
			var that = this;
			var getView = this.getView().byId("ip_address");
			var getAddress = getView.getProperty("value");
			var getCity = this.getView().byId("filterCity").getSelectedItem().getText();
			var getDis = this.getView().byId("filterDistrict").getSelectedItem().getText();
			var fullAddress = getAddress + ", " + getDis + "," + getCity;
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'address': fullAddress
			}, function(results, status) {
				if (status === 'OK') {
					gMap.setCenter(results[0].geometry.location);
					markers = new google.maps.Marker({
						map: gMap,
						position: results[0].geometry.location,
						draggable: true
					});
					var currentLatitude = markers.getPosition().lat();
					var currentLongitude = markers.getPosition().lng();
					that.getModel("modelRegister").setProperty("/lat", currentLatitude);
					that.getModel("modelRegister").setProperty("/lng", currentLongitude);
					that.getLatLng(markers);
				} else {
					MessageBox.error("Địa chỉ bạn nhập chưa đúng!");
				}
			});
		},

		getLatLng: function(marker) {
			var that = this;
			google.maps.event.addListener(marker, 'dragend', function(marker) {
				var latLng = marker.latLng;
				var currentLatitude = latLng.lat();
				var currentLongitude = latLng.lng();
				that.getModel("modelRegister").setProperty("/lat", currentLatitude);
				that.getModel("modelRegister").setProperty("/lng", currentLongitude);
			});
		},

		setLocation: function(lat, lng) {
			var that = this;
			var latLong = new google.maps.LatLng(lat, lng);
			var myEmail = this.getGlobalModel().getProperty("/username");
			var content = "<h3>" + myEmail + "</h3>";

			markers = new google.maps.Marker({
				position: latLong,
				map: gMap,
				draggable: true
			});
			var infowindow = new google.maps.InfoWindow({
				content: content
			});
			markers.addListener('click', function() {
				infowindow.open(gMap, markers);
			});
			google.maps.event.addListener(markers, 'dragend', function(marker) {
				var latLng = marker.latLng;
				var currentLatitude = latLng.lat();
				var currentLongitude = latLng.lng();
				that.getModel("modelRegister").setProperty("/lat", currentLatitude);
				that.getModel("modelRegister").setProperty("/lng", currentLongitude);
			});
			markers.setMap(gMap);

			gMap.setZoom(15);
			gMap.setCenter(markers.getPosition());
		},

		getDataCity: function() {
			//get data city
			var dataCiti = models.getDataCity();
			if (dataCiti) {
				var oModelCiti = this.getModel("dataCity");
				oModelCiti.setProperty("/results", dataCiti);
				oModelCiti.setProperty("/selectedCity", dataCiti[0].id);
				oModelCiti.updateBindings();
			}
			//get data district
			var dataDistrict = models.getDataDistrictRegister();
			if (dataDistrict) {
				var dataDis = [];
				for (var i = 0; i < dataDistrict.length; i++) {
					dataDis.push(dataDistrict[i]);
				}

				var oModelDis = new JSONModel();
				oModelDis.setData({
					results: dataDis
				});
				this.setModel(oModelDis, "dataDis");
				this.onChangeCity();
			}
		},

		getDistrictByCity: function(cityId) {
			var filters = [];
			var cityIdFilter = new sap.ui.model.Filter({
				path: "cityId",
				operator: "EQ",
				value1: cityId
			});
			filters.push(cityIdFilter);
			this.byId("filterDistrict").getBinding("items").filter(filters);
		},

		onChangeCity: function() {
			var cityModel = this.getModel("dataCity");
			if (cityModel) {
				// var cityContext = this.getView().byId("filterCity").getSelectedItem().getKey();
				var keyCity = cityModel.getProperty("/selectedCity");
				this.getDistrictByCity(keyCity);
			}
		},

		onAfterRendering: function() {
			var mapOptions = {
				center: new google.maps.LatLng(0, 0),
				zoom: 10,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			gMap = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(), mapOptions);
		}
	});

});