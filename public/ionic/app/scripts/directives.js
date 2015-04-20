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
