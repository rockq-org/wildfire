angular.module('iwildfire.directives', [])

.directive('qqMap', function(cfg) {
    var host = location.href.split('#')[0];
    var markers = [];
    var center;
    var infoWin;

    function addControl(container, style){
        var control = document.createElement("div");
        control.style.left = style.left + "px";
        control.style.top = style.top + "px";
        control.style.position = "relative";
        control.style.width = "36px";
        control.style.height = "36px";
        control.style.zIndex = "100000";
        control.innerHTML = '<img src="' + host + 'images/map/' + style.iconName + '" />';
        container.appendChild(control);
        return control;
    }

    function updateTopicsMarkers(topics){
        for(var i in topics){
            (function(n) {
                var marker = new qq.maps.Marker({ map: map });
                var position = {lat: 25.3518140000000010 + i * 0.003, lng: 118.7042859999999962 + i * 0.003};
                position = new qq.maps.LatLng(position.lat, position.lng);

                marker.setPosition( position );

                var anchor = new qq.maps.Point(0, 36),
                    size = new qq.maps.Size(36, 36),
                    origin = new qq.maps.Point(0, 0),
                    markerIcon = new qq.maps.MarkerImage( "/images/map/1.png", size, origin, anchor );

                marker.setIcon(markerIcon);

                marker.setTitle(i + 1);
                markers.push(marker);

                qq.maps.event.addListener(marker, 'click', function() {
                    console.log(topics[n].goods_pics[0]);
                    var content = '<div style="width:180px;height:180px;">';
                    content += topics[n].title;
                    content += '转卖价：' + topics[n].goods_now_price;
                    content += '原价：' + topics[n].goods_pre_price;
                    content += '<img height="100px" src="' + cfg.server + topics[n].goods_pics[0] + '" />';
                    content += '<br /><a href="#/item/' + topics[n].id + '">点击查看详情</a></div>';
                    infoWin.open();
                    infoWin.setContent( content );
                    infoWin.setPosition( position );
                });
            })(i);
        }
    };

    function link(scope, element, attrs){
        var $wrap = element.parent().parent();
        var $element = angular.element( element );
        var container = $element.get(0);
        var height = $wrap.height() - 44 - 50;
        center = new qq.maps.LatLng(scope.center.lat, scope.center.lng);

        $element.width( $wrap.width() );
        $element.height( height );

        map = new qq.maps.Map( container, {
            center: center,
            zoom: scope.zoom,
            zoomControl: false,
            mapTypeControl: false
        });

        infoWin = new qq.maps.InfoWindow({ map: map });
        // add relocated control
        var style = {
            left: 15,
            top: height - 64,
            iconName: '2.png'
        };
        var relocatedControl = addControl(container, style);
        qq.maps.event.addListener(relocatedControl, 'click', function(){
            console.log('do the relocated stuff');
        });

        // add reset control
        var style = {
            left: 60,
            top: height - 100,
            iconName: '3.png'
        };
        var resetControl = addControl(container, style);
        qq.maps.event.addListener(resetControl, 'click', function() {
            map.panTo( center );
        });

        // center marker
        var centerMarker = new qq.maps.Marker({ map: map });
        centerMarker.setPosition(center);

        // topics markers
        scope.$watchCollection('topics', function(newData, oldData){
            updateTopicsMarkers(newData);
        });
    }

    return {
        scope: {
            center: "=",
            zoom: "=",
            topics: "=*"
        },
        link: link
    };
})

.directive('chooseLocation', function($timeout, $document, webq) {
    var init = function(element, attrs, scope, locationDetail, width, height) {
        //初始化地图
        console.log(scope.locationDetail.lat);
        console.log(scope.locationDetail.lat);
        var center = new qq.maps.LatLng(locationDetail.lat, locationDetail.lng);
        var newCenter = new qq.maps.LatLng(locationDetail.lat, locationDetail.lng);
        var map = new qq.maps.Map(element, {
            // 地图的中心地理坐标
            center: center,
            zoomControl: false,
            mapTypeControl: false,
            zoom: 17
        });
        var address = locationDetail.api_address;
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
        middleControl.innerHTML = '<img src="/images/map/2.png" />';
        element.appendChild(middleControl);
        // qq.maps.event.addListener(middleControl, 'click', function(){
        //     info.open();
        //     info.setContent('<div style="text-align:center;white-space:nowrap;'+
        //     'margin:10px;">' + address + '</div>');
        //     info.setPosition(center);
        // });

        var resetControl = document.createElement("div");
        resetControl.style.left = 15 + "px";
        resetControl.style.top = height - 100 + "px";
        resetControl.style.position = "relative";
        resetControl.style.width = "36px";
        resetControl.style.height = "36px";
        resetControl.style.zIndex = "100000";
        resetControl.innerHTML = '<img src="/images/map/3.png" />';
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
                    scope.$parent.$parent.locationDetail.lat = result.detail.location.lat;
                    scope.$parent.$parent.locationDetail.lng = result.detail.location.lng;
                    newCenter = new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng);
                });
            }
        });

        center_changed();
    }

    return function(scope, element, attrs) {
        webq.getLocationDetail().then(function(locationDetail){
            var width = $document.width();
            var height = $document.height() - 44;
            var div = angular.element(element).find('div');
            div.width(width);
            div.height(height);
            init(div[0], attrs, scope, locationDetail, width, height);
        });
    };
})
