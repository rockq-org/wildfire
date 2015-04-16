angular.module('iwildfire.directive', [])

.directive('map', function () {
    var searchService,map,markers = [];
    var init = function(element) {
        var center = new qq.maps.LatLng(39.936273,116.44004334);
        map = new qq.maps.Map( element, {
            center: center,
            zoom: 13,
            zoomControl: false,
            panControl: false,
            mapTypeControl: false
        });
        new qq.maps.Circle({
            center:new qq.maps.LatLng(39.936273,116.44004334),
            radius: 2000,
            map: map
        });
        var latlngBounds = new qq.maps.LatLngBounds();
        searchService = new qq.maps.SearchService({
            complete : function(results){
              console.log(results);
                var pois = results.detail.pois;
                for(var i = 0,l = pois.length;i < l; i++){
                    var poi = pois[i];
                    latlngBounds.extend(poi.latLng);
                    var marker = new qq.maps.Marker({
                        map:map,
                        position: poi.latLng
                    });

                    marker.setTitle(i+1);

                    markers.push(marker);
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
      var height = $('ion-content').height();
      element.height( height );
      init( element[0] );
    };
  })
