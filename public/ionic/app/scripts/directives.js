angular.module('iwildfire.directives', [])

.directive('map', function () {
    var searchService,map,markers = [];
    var init = function(element) {
        var center = new qq.maps.LatLng(39.936273,116.44004334);
        map = new qq.maps.Map( element, {
            center: center,
            zoom: 13,
            // zoomControl: false,
            // panControl: false,
            mapTypeControl: false
        });
        new qq.maps.Circle({
            center:new qq.maps.LatLng(39.936273,116.44004334),
            radius: 2000,
            map: map
        });
        searchService = new qq.maps.SearchService({
            complete : function(results){
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
        region = new qq.maps.LatLng(39.936273,116.44004334);

        searchService.setPageCapacity(5);
        searchService.searchNearBy(keyword, region, 2000);
    }

    return function (scope, element, attrs) {
      scope.searchKeyword = searchKeyword;
      var height = angular.element(element).parent().parent().height();
      var div = angular.element(element).find('div');
      div.height( height - 100 );
      init( div[0] );
    };
})

.directive('chooseLocation', function () {
    var init = function(element, centerDiv, attrs) {
        //初始化地图
        var map = new qq.maps.Map(element, {
            // 地图的中心地理坐标
            center: new qq.maps.LatLng(attrs.latitude, attrs.longitude),
            zoom: 17
        });

        //创建自定义控件
        var middleControl = document.createElement("div");
        middleControl.style.left="184px";
        middleControl.style.top="232px";
        middleControl.style.position="relative";
        middleControl.style.width="36px";
        middleControl.style.height="36px";
        middleControl.style.zIndex="100000";
        middleControl.innerHTML ='<img src="https://www.cdlhome.com.sg/mobile_assets/images/icon-location.png" />';
        element.appendChild(middleControl);

        var geocoder = new qq.maps.Geocoder({
            complete : function(result){
                centerDiv.innerHTML = result.detail.location + result.detail.address;
            }
        });

        //返回地图当前中心点地理坐标
        centerDiv.innerHTML = "latlng:" + map.getCenter();
        //当地图中心属性更改时触发事件
        qq.maps.event.addListener(map, 'center_changed', function() {
            var latLng = map.getCenter();
            geocoder.getAddress(latLng);
        });
    }

    return function (scope, element, attrs) {
      var div = angular.element(element).find('div');
      init( div[0], div[1], attrs );
    };
})

.directive('goodsBadge', function () {

})
