angular.module('iwildfire.directives', [])

.directive('map', function() {
    var searchService, map, markers = [];
    var init = function(element) {
        var center = new qq.maps.LatLng(39.936273, 116.44004334);
        map = new qq.maps.Map(element, {
            center: center,
            zoom: 13,
            // zoomControl: false,
            // panControl: false,
            mapTypeControl: false
        });
        new qq.maps.Circle({
            center: new qq.maps.LatLng(39.936273, 116.44004334),
            radius: 2000,
            map: map
        });
        searchService = new qq.maps.SearchService({
            complete: function(results) {
                //设置回调函数参数
                var pois = results.detail.pois;
                var infoWin = new qq.maps.InfoWindow({
                    map: map
                });
                var latlngBounds = new qq.maps.LatLngBounds();
                for (var i = 0, l = pois.length; i < l; i++) {
                    var poi = pois[i];
                    //扩展边界范围，用来包含搜索到的Poi点
                    latlngBounds.extend(poi.latLng);

                    (function(n) {
                        var marker = new qq.maps.Marker({
                            map: map
                        });
                        marker.setPosition(pois[n].latLng);

                        marker.setTitle(i + 1);
                        markers.push(marker);

                        qq.maps.event.addListener(marker, 'click', function() {
                            infoWin.open();
                            infoWin.setContent('<div style="width:180px;height:180px;">二手自行车卖啦转卖价：1000 原价：2000                              <img height="100px" src="http://img03.taobaocdn.com/imgextra/i3/691389747/TB2ppC1cpXXXXa1XpXXXXXXXXXX_!!691389747-0-fleamarket.jpg_728x728.jpg" /> <br /><a href="#">点击查看详情</a></div>');
                            infoWin.setPosition(pois[n].latLng);
                        });
                    })(i);
                }
                map.fitBounds(latlngBounds);
            }
        });
        searchKeyword();
    }

    function searchKeyword() {
        // var keyword = document.getElementById("keyword").value;
        var keyword = '酒店';
        region = new qq.maps.LatLng(39.936273, 116.44004334);

        searchService.setPageCapacity(5);
        searchService.searchNearBy(keyword, region, 2000);
    }

    return function(scope, element, attrs) {
        scope.searchKeyword = searchKeyword;
        var height = angular.element(element).parent().parent().height();
        var div = angular.element(element).find('div');
        div.height(height - 100);
        init(div[0]);
    };
})

.directive('chooseLocation', function($timeout, $document) {
    var init = function(element, attrs, scope, width, height) {
        //初始化地图
        var center = new qq.maps.LatLng(scope.locationDetail.latitude, scope.locationDetail.longitude);
        var newCenter = new qq.maps.LatLng(scope.locationDetail.latitude, scope.locationDetail.longitude);
        var map = new qq.maps.Map(element, {
            // 地图的中心地理坐标
            center: center,
            zoom: 17
        });
        var address = scope.locationDetail.api_address;
        var info = new qq.maps.InfoWindow({
            map: map
        });

        //创建自定义控件
        var middleControl = document.createElement("div");
        middleControl.style.left = (width - 36) / 2 + "px";
        middleControl.style.top = (height - 36) / 2 + "px";
        middleControl.style.position = "relative";
        middleControl.style.width = "36px";
        middleControl.style.height = "36px";
        middleControl.style.zIndex = "100000";
        middleControl.innerHTML = '<img src="https://www.cdlhome.com.sg/mobile_assets/images/icon-location.png" />';
        element.appendChild(middleControl);
        // qq.maps.event.addListener(middleControl, 'click', function(){
        //     info.open();
        //     info.setContent('<div style="text-align:center;white-space:nowrap;'+
        //     'margin:10px;">' + address + '</div>');
        //     info.setPosition(center);
        // });

        var resetControl = document.createElement("div");
        resetControl.style.left = 15 + "px";
        resetControl.style.top = height - 200 + "px";
        resetControl.style.position = "relative";
        resetControl.style.width = "36px";
        resetControl.style.height = "36px";
        resetControl.style.zIndex = "100000";
        resetControl.innerHTML = '<img src="https://www.cdlhome.com.sg/mobile_assets/images/icon-location.png" />';
        element.appendChild(resetControl);
        qq.maps.event.addListener(resetControl, 'click', function() {
            console.log('here!');
            map.panTo( center );
        });

        //当地图中心属性更改时触发事件
        qq.maps.event.addListener(map, 'center_changed', center_changed);

        function center_changed() {
            var latLng = map.getCenter();
            geocoder.getAddress(latLng);
        }
        var geocoder = new qq.maps.Geocoder({
            complete: function(result) {
                $timeout(function() {
                    var c = result.detail.addressComponents;
                    address = c.city + c.district + c.street + c.streetNumber + c.town + c.village;
                    scope.$parent.$parent.locationDetail.api_address = result.detail.address;
                    scope.$parent.$parent.locationDetail.user_edit_address = address;
                    scope.$parent.$parent.locationDetail.latitude = result.detail.location.lat;
                    scope.$parent.$parent.locationDetail.longitude = result.detail.location.lng;
                    newCenter = new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng);
                });
            }
        });

        center_changed();
    }

    return function(scope, element, attrs) {
        $timeout(function() {
            var width = $document.width();
            var height = $document.height() - 44;
            var div = angular.element(element).find('div');
            div.width(width);
            div.height(height);
            init(div[0], attrs, scope, width, height);
        });
    };
})

;
