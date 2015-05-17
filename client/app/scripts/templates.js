angular.module('iwildfire.templates', ['templates/bind-access-token.html', 'templates/bind-mobile-phone.html', 'templates/inbox-detail.html', 'templates/item.html', 'templates/modal-change-location.html', 'templates/modal-post-goods-desp.html', 'templates/settings/about.html', 'templates/settings/feedback.html', 'templates/settings/help.html', 'templates/settings/index.html', 'templates/settings/service-agreement.html', 'templates/tab-account.html', 'templates/tab-inbox.html', 'templates/tab-index.html', 'templates/tab-maps.html', 'templates/tab-post.html', 'templates/tabs.html']);

angular.module("templates/bind-access-token.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/bind-access-token.html",
    "<ion-view view-title=\"\">\n" +
    "    <ion-content>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/bind-mobile-phone.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/bind-mobile-phone.html",
    "<ion-view view-title=\"呱呱二手\">\n" +
    "  <ion-content>\n" +
    "    <div class=\"list padding\">\n" +
    "      <h3 class=\"padding text-center\">欢迎加入呱呱二手</h3>\n" +
    "      <label class=\"item-input item-select\">\n" +
    "        <div class=\"input-label\" style=\"width:100%\">\n" +
    "          选择国家/地区\n" +
    "        </div>\n" +
    "        <select>\n" +
    "          <option value='1' selected>中国大陆&nbsp;&nbsp;&nbsp;+86</option>\n" +
    "          <!-- <option value='2'>中国台湾(+886)</option> -->\n" +
    "          <!-- <option value='3'>中国香港(+852)</option> -->\n" +
    "        </select>\n" +
    "      </label>\n" +
    "      <div class=\"item-input-inset\">\n" +
    "        <label class=\"item-input-wrapper\">\n" +
    "          <input id=\"phoneNumber\" ng-model=\"data.phoneNumber\" type=\"text\" placeholder=\"手机号码\">\n" +
    "        </label>\n" +
    "        <button ng-click=\"sendVerifyCode()\" class=\"button button-royal button-small\" ng-class=\"{'button-disabled':waitFor60Seconds}\" ng-disabled=\"waitFor60Seconds\">\n" +
    "          {{submitTxt}}\n" +
    "        </button>\n" +
    "      </div>\n" +
    "      <div class=\"item-input-inset\">\n" +
    "        <label class=\"item-input-wrapper\" style=\"margin-right: 160px;\">\n" +
    "          <input id=\"verifyCode\" ng-model=\"data.verifyCode\" type=\"text\" placeholder=\"输入四位验证码\">\n" +
    "        </label>\n" +
    "      </div>\n" +
    "      <div class=\"item item-text-wrap\" style=\"border:none;\" ng-click=\"openModal($event)\">\n" +
    "        点击「确定」按钮，代表你已阅读并同意 <span style=\"border-bottom:1px solid #000;\">《软件许可及服务协议》</span>\n" +
    "      </div>\n" +
    "      <button class=\"button button-block button-royal\" ng-click=\"bindPhoneNumber()\">\n" +
    "        确定\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</ion-view>\n" +
    "<script id=\"modal-service-agreements.html\" type=\"text/ng-template\">\n" +
    "  <ion-modal-view>\n" +
    "    <ion-header-bar class=\"bar-royal\">\n" +
    "      <h1 class=\"title\">用户协议</h1>\n" +
    "      <button ng-click=\"closeModal()\" class=\"button button-clear\">关闭</button>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div class=\"card\" ng-show=\"data.service_agreements==null\">\n" +
    "            <div class=\"item item-text-wrap\">\n" +
    "                加载中...\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"padding\" ng-bind-html='data.service_agreements'>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "  </ion-modal-view>\n" +
    "</script>");
}]);

angular.module("templates/inbox-detail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/inbox-detail.html",
    "<!--\n" +
    "  This template loads for the 'tab.friend-detail' state (app.js)\n" +
    "  'friend' is a $scope variable created in the FriendsCtrl controller (controllers.js)\n" +
    "  The FriendsCtrl pulls data from the Friends service (service.js)\n" +
    "  The Friends service returns an array of friend data\n" +
    "-->\n" +
    "<ion-view view-title=\"{{chat.name}}\">\n" +
    "  <ion-content class=\"padding\">\n" +
    "    <ion-list>\n" +
    "      <ion-item class=\"item-remove-animate item-avatar item-icon-right\" ng-repeat=\"item in items\" type=\"item-text-wrap2\" href=\"#/tab/item/{{chat.id}}\">\n" +
    "        <img ng-src=\"{{item.img}}\">\n" +
    "        <h2>{{item.price}}</h2>\n" +
    "        <p>{{item.desc}}</p>\n" +
    "        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n" +
    "      </ion-item>\n" +
    "    </ion-list>\n" +
    "    <br>\n" +
    "\n" +
    "    <ion-list>\n" +
    "      <ion-item ng-class=\"itemClass(chat)\" ng-repeat=\"chat in chats\" type=\"item-text-wrap\" href=\"#/tab/inbox/{{chat.id}}\">\n" +
    "        <img ng-src=\"{{chat.face}}\">\n" +
    "        <p>{{chat.lastText}}</p>\n" +
    "      </ion-item>\n" +
    "    </ion-list>\n" +
    "  </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/item.html",
    "<ion-view view-title=\"topic.title||'呱呱二手'\">\n" +
    "  <ion-nav-buttons side=\"left\">\n" +
    "    <a class=\"button button-icon icon ion-ios-arrow-back\" href=\"#tab/index\"></a>\n" +
    "  </ion-nav-buttons>\n" +
    "  <ion-content class=\"has-header has-footer\" ng-class=\"(status.action!='normal')?'has-reply':''\">\n" +
    "    <ion-refresher pulling-text=\"下拉刷新...\" on-refresh=\"doRefresh()\">\n" +
    "    </ion-refresher>\n" +
    "\n" +
    "    <ion-slide-box style=\"height: 200px;\" does-continue=\"true\" auto-play=\"true\" slide-interval=\"4000\">\n" +
    "        <ion-slide ng-repeat=\"pic in topic.goods_pics\">\n" +
    "          <div style=\"width:100%; height:100%; background:url('{{img_prefix}}{{pic}}') center no-repeat; background-size:cover\" ng-click=\"showSlidePreview(pic)\"></div>\n" +
    "        </ion-slide>\n" +
    "    </ion-slide-box>\n" +
    "    <span class=\"{{topic.goods_quality_degree | badge}}\">{{topic.goods_quality_degree}}</span>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"price col col50\">\n" +
    "        <h3>\n" +
    "        <span class=\"assertive\">￥ {{topic.goods_now_price}}</span>\n" +
    "        &nbsp;\n" +
    "        <del ng-if=\"topic.goods_pre_price\">￥ {{topic.goods_pre_price}}</del>\n" +
    "        </h3>\n" +
    "        <button class=\"button button-assertive button-small\">{{topic.goods_is_bargain?'接受侃价':'谢绝侃价'}}</button>\n" +
    "        &nbsp;\n" +
    "        <button class=\"button button-clear button-small ion-alert-circled\" ng-click=\"complainTopic(topic)\"> 举报</button>\n" +
    "        <br />\n" +
    "        <a ng-if=\"isCollected\" class=\"button button-clear button-assertive\" ng-click=\"collectTopic()\">\n" +
    "          <i class=\" icon ion-ios-heart\"> </i> {{topic.collect_count + 0}} 已收藏\n" +
    "        </a>\n" +
    "        <a ng-if=\"!isCollected\" class=\"button button-clear button-assertive\" ng-click=\"collectTopic()\">\n" +
    "          <i class=\" icon ion-ios-heart-outline\"> </i> {{topic.collect_count + 0}}\n" +
    "        </a>\n" +
    "        &nbsp;<span class=\"visit-count\">浏览 {{topic.visit_count + 1}}</span>\n" +
    "      </div>\n" +
    "      <div class=\"col col50 text-right\">\n" +
    "        <div class=\"name-avatar item-content\">\n" +
    "          <img ng-src='{{topic.author.avatar}}' />\n" +
    "          <span>{{topic.author.name}}</span>\n" +
    "        </div>\n" +
    "        <div class=\"item-content\"><i class=\"icon ion-ios-location mr5\"></i>{{topic.goods_exchange_location.user_edit_address}}</div>\n" +
    "        <div class=\"item-note\">\n" +
    "          {{topic.goods_exchange_location | flatternDistance:currentLocation}}<br />\n" +
    "          <span am-time-ago=\"topic.update_at\"></span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"dot-line padding\">\n" +
    "      <h5>宝贝详情</h4>\n" +
    "      <div class=\"topic-content\" ng-bind-html=\"topic.content | link\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"button-bar\">\n" +
    "      <a ng-click=\"status.showBargains = true\" ng-class=\"status.showBargains?'active':''\" class=\"button button-outline button-small\">出价（{{bargains.length + 0}}）</a>\n" +
    "      <a ng-click=\"status.showBargains = false\" ng-class=\"status.showBargains?'':'active'\" class=\"button button-outline button-small\"> 留言（{{replies.length + 0}}）</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <ion-list class=\"bargains\" ng-show=\"status.showBargains\">\n" +
    "      <ion-item class=\"item-loading\" ng-if=\"bargains == undefined\">\n" +
    "        <span ng-if=\"!loadError\">\n" +
    "          加载中...\n" +
    "        </span>\n" +
    "        <span ng-if=\"loadError\">\n" +
    "          加载失败\n" +
    "        </span>\n" +
    "      </ion-item>\n" +
    "      <ion-item ng-if=\"bargains.length == 0\">\n" +
    "        暂无出价\n" +
    "      </ion-item>\n" +
    "      <ion-item ng-class=\"reply.author.loginname == topic.author.loginname?'item-avatar-right':'item-avatar'\" ng-repeat=\"reply in bargains\" ng-click=\"bargainTo(reply.author)\">\n" +
    "        <img ng-src=\"{{reply.author.avatar}}\">\n" +
    "        <p>\n" +
    "          <span ng-class=\"{'bold': reply.author.loginname == topic.author.loginname}\">\n" +
    "            {{reply.author.name}}\n" +
    "          </span>\n" +
    "          <span class=\"assertive\" ng-if=\"!reply.reply_to\">\n" +
    "            出价 ￥ {{reply.price}}\n" +
    "          </span>\n" +
    "          <span class=\"assertive\" ng-if=\"reply.reply_to\">\n" +
    "            回复 {{ reply.reply_to}}\n" +
    "          </span>\n" +
    "          <span class=\"item-note\" am-time-ago=\"reply.create_at\">\n" +
    "          </span>\n" +
    "        </p>\n" +
    "        <div class=\"item-text-wrap\" ng-bind-html=\"reply.content | link\"></div>\n" +
    "      </ion-item>\n" +
    "    </ion-list>\n" +
    "\n" +
    "    <ion-list class=\"replies\" ng-show=\"!status.showBargains\">\n" +
    "      <ion-item class=\"item-loading\" ng-if=\"replies == undefined\">\n" +
    "        <span ng-if=\"!loadError\">\n" +
    "          加载中...\n" +
    "        </span>\n" +
    "        <span ng-if=\"loadError\">\n" +
    "          加载失败\n" +
    "        </span>\n" +
    "      </ion-item>\n" +
    "      <ion-item ng-if=\"replies.length == 0\">\n" +
    "        暂无评论\n" +
    "      </ion-item>\n" +
    "      <ion-item ng-class=\"reply.author.loginname == topic.author.loginname?'item-avatar-right':'item-avatar'\" ng-repeat=\"reply in replies\" ng-click=\"replyTo(reply.author)\">\n" +
    "        <img ng-src=\"{{reply.author.avatar}}\">\n" +
    "        <p>\n" +
    "          <span ng-class=\"{'bold': reply.author.loginname == topic.author.loginname}\">\n" +
    "            {{reply.author.name}}\n" +
    "          </span>\n" +
    "          <span class=\"assertive\" ng-if=\"reply.reply_to\">\n" +
    "            回复 {{ (reply.reply_to == topic.author.name)? '卖家':reply.reply_to}}\n" +
    "          </span>\n" +
    "          <span class=\"item-note\" am-time-ago=\"reply.create_at\">\n" +
    "          </span>\n" +
    "        </p>\n" +
    "        <div class=\"item-text-wrap\" ng-bind-html=\"reply.content | link\"></div>\n" +
    "      </ion-item>\n" +
    "    </ion-list>\n" +
    "\n" +
    "  </ion-content>\n" +
    "  <div class=\"bar bar-footer\" ng-show=\"status.action=='normal'\">\n" +
    "    <div class=\"tabs tabs-color-royal\">\n" +
    "      <a ng-show=\"!isSeller\" class=\"tab-item\" ng-click=\"bargainTo()\">\n" +
    "        我要出价\n" +
    "      </a>\n" +
    "      <div ng-show=\"!isSeller\" class=\"tab-item\">\n" +
    "        <i ng-click=\"showContact=!showContact\" class=\"icon frog-icon frog2\"></i>\n" +
    "        <a class=\"tab-item\" href=\"tel:{{topic.author.phone_number | addPlatFormPostFix}}\"><i ng-show=\"showContact\" class=\"icon ion-ios-telephone phone-icon\"></i></a>\n" +
    "        <a class=\"tab-item\" href=\"sms:{{topic.author.phone_number | addPlatFormPostFix}}\"><i ng-show=\"showContact\" class=\"icon ion-ios-chatbubble message-icon\"></i></a>\n" +
    "      </div>\n" +
    "      <a class=\"tab-item\" ng-click=\"replyTo(topic.author)\">\n" +
    "        我要留言\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"bar bar-footer\" ng-show=\"status.action=='bid'\" style=\"background:#ddd;height: 150px;display:block;\" keyboard-attach>\n" +
    "      <div class=\"row\" style=\"display:block;\">\n" +
    "        <button class=\"button button-small button-clear button-dark float-left\" ng-click=\"status.action='normal'\">\n" +
    "          取消\n" +
    "        </button>\n" +
    "        <button class=\"button button-small button-clear button-royal float-right\" ng-click=\"saveReply()\">\n" +
    "          发送\n" +
    "        </button>\n" +
    "      </div>\n" +
    "      <div ng-show=\"isSeller\" class=\"row\" style=\"padding:10px;\">\n" +
    "        <label class=\"col col-25\">\n" +
    "          回复\n" +
    "        </label>\n" +
    "        <span class=\"col col-75\">{{ (replyData.replyTo.name == topic.author.name)? '卖家':replyData.replyTo.name}}</span>\n" +
    "      </div>\n" +
    "      <div ng-show=\"!isSeller\" class=\"row\" style=\"padding:10px;\">\n" +
    "        <label class=\"col col-25\">\n" +
    "          出价&nbsp;&nbsp;&nbsp;￥\n" +
    "        </label>\n" +
    "        <input class=\"col col-25\" style=\"padding:2px 6px;\" type=\"text\" placeholder=\"\" ng-model=\"replyData.price\">\n" +
    "      </div>\n" +
    "      <div class=\"row\" style=\"padding:10px;\">\n" +
    "        <label class=\"col col-25\">\n" +
    "          说点什么\n" +
    "        </label>\n" +
    "        <input class=\"col col-75\" style=\"padding:2px 6px;\" type=\"text\" placeholder=\"\" ng-model=\"replyData.content\"></input>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "  <div class=\"bar bar-footer\" ng-show=\"status.action=='reply'\" style=\"background:#ddd;height: 150px;display:block;\" keyboard-attach>\n" +
    "      <div class=\"row\" style=\"display:block;\">\n" +
    "        <button class=\"button button-small button-clear button-dark float-left\" ng-click=\"status.action='normal'\">\n" +
    "          取消\n" +
    "        </button>\n" +
    "        <button class=\"button button-small button-clear button-royal float-right\" ng-click=\"saveReply()\">\n" +
    "          发送\n" +
    "        </button>\n" +
    "      </div>\n" +
    "      <div class=\"row\" style=\"padding:10px;\">\n" +
    "        <label class=\"col col-25\">\n" +
    "          回复\n" +
    "        </label>\n" +
    "        <span class=\"col col-75\">{{ (replyData.replyTo.name == topic.author.name)? '卖家':replyData.replyTo.name}}</span>\n" +
    "      </div>\n" +
    "      <div class=\"row\" style=\"padding:10px;\">\n" +
    "        <label class=\"col col-25\">\n" +
    "          说点什么\n" +
    "        </label>\n" +
    "        <input class=\"col col-75\" style=\"padding:2px 6px;\" type=\"text\" placeholder=\"\" ng-model=\"replyData.content\"></input>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/modal-change-location.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/modal-change-location.html",
    "<div class=\"modal\">\n" +
    "  <ion-header-bar class=\"bar-royal\">\n" +
    "    <div class=\"buttons\">\n" +
    "      <button class=\"button button-clear button-light\" ng-click=\"closeChangeLocationModal()\">关闭</button>\n" +
    "    </div>\n" +
    "    <h1 class=\"title\">\n" +
    "      <input type=\"text\" class=\"user-add-text\" ng-model=\"locationDetail.user_edit_address \" />\n" +
    "    </h1>\n" +
    "    <div class=\"buttons \">\n" +
    "      <button class=\"button button-clear \" ng-click=\"closeChangeLocationModal(true) \" >提交</button>\n" +
    "    </div>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content scroll=\"false \">\n" +
    "    <div choose-location>\n" +
    "      <div class=\"container \"></div>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/modal-post-goods-desp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/modal-post-goods-desp.html",
    "<ion-modal-view>\n" +
    "  <ion-header-bar class=\"bar-royal\">\n" +
    "    <div class=\"buttons\">\n" +
    "      <button class=\"button button-clear\" ng-click=\"closeGoodsDespModal()\">关闭</button>\n" +
    "    </div>\n" +
    "    <h1 class=\"title\">\n" +
    "        宝贝描述\n" +
    "    </h1>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content>\n" +
    "    <div class=\"list\">\n" +
    "      <label class=\"item item-input\">\n" +
    "        <!-- focus-me does not work -->\n" +
    "        <!-- http://forum.ionicframework.com/t/auto-focus-textbox-while-template-loads/6851/5 -->\n" +
    "        <!-- needs more permission in config -->\n" +
    "        <textarea ng-model=\"params.content\" placeholder=\"您的宝贝的详细描述。\" maxlength=\"300\" style=\"height:120px\"></textarea>\n" +
    "      </label>\n" +
    "      <button class=\"button button-block button-royal\" ng-click=\"closeGoodsDespModal()\">\n" +
    "        保存\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</ion-modal-view>\n" +
    "");
}]);

angular.module("templates/settings/about.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/settings/about.html",
    "<ion-view view-title=\"呱呱二手\" hide-nav-bar=\"true\">\n" +
    "    <ion-header-bar class=\"bar-royal\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button icon-left ion-ios-arrow-left button-clear \" ng-click=\"goBackSettings()\"></button>\n" +
    "        </div>\n" +
    "        <h1 class=\"title\">关于 呱呱二手</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div class=\"list card\">\n" +
    "            <div class=\"item item-avatar\">\n" +
    "                <img src=\"images/frog-icon.png\">\n" +
    "                <h2>呱呱二手</h2>\n" +
    "                <p>版本 v1.0, Build {{data.build}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"item item-text-wrap\">\n" +
    "                呱呱二手是一款主打校园、近距离的闲置及二手物品的交易平台，并立志于提供有别于现有常规的BBS，贴吧，weibo等手段的更好的用户体验，更好的完成近距闲置物品交易行为。\n" +
    "            </div>\n" +
    "            <div class=\"item item-text-wrap\">\n" +
    "                呱呱二手的发展愿景就是促进物品价值的物尽其用，并推动循环经济的理念深入人心。\n" +
    "            </div>\n" +
    "            <div class=\"item item-text-wrap\">\n" +
    "                呱呱二手使用方法，基于微信公众号的方式，使用时无需下载，能看快速浏览，发布以及简化二手及闲置转让中出现的各种沟通成本，让二手及闲置转让真正变得更加简单易用高效。\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/settings/feedback.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/settings/feedback.html",
    "<ion-view view-title=\"呱呱二手\" hide-nav-bar=\"true\">\n" +
    "    <ion-header-bar class=\"bar-royal\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button icon-left ion-ios-arrow-left button-clear \" ng-click=\"goBackSettings()\"></button>\n" +
    "        </div>\n" +
    "        <h1 class=\"title\">{{data.feedback.title}}</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div class=\"list\">\n" +
    "            <label class=\"item item-input\">\n" +
    "                <!-- focus-me does not work -->\n" +
    "                <!-- http://forum.ionicframework.com/t/auto-focus-textbox-while-template-loads/6851/5 -->\n" +
    "                <!-- needs more permission in config -->\n" +
    "                <textarea ng-model=\"data.feedback.content\" placeholder=\"这是给没有节操的Product Manager的一封匿名信\" style=\"height:150px\"></textarea>\n" +
    "            </label>\n" +
    "            <button class=\"button button-block button-outline button-positive\" ng-click=\"submitFeedback()\">\n" +
    "                提交\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/settings/help.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/settings/help.html",
    "<ion-view view-title=\"呱呱二手\" hide-nav-bar=\"true\">\n" +
    "    <ion-header-bar class=\"bar-royal\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button icon-left ion-ios-arrow-left button-clear \" ng-click=\"goBackSettings()\"></button>\n" +
    "        </div>\n" +
    "        <h1 class=\"title\">帮助</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        帮助\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/settings/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/settings/index.html",
    "<ion-view view-title=\"呱呱二手\" hide-nav-bar=\"true\">\n" +
    "    <ion-header-bar class=\"bar-royal\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button icon-left ion-ios-arrow-left button-clear \" ng-click=\"goBackProfile()\"></button>\n" +
    "        </div>\n" +
    "        <h1 class=\"title\">我的设置</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div class=\"list\">\n" +
    "            <a class=\"item item-icon-right\" href=\"javascript:void(0)\">\n" +
    "                        手机号码 {{data.phone}}\n" +
    "                        <i class=\"icon royal ion-iphone\"></i>\n" +
    "                    </a>\n" +
    "            <li class=\"item item-toggle\">\n" +
    "                消息提醒\n" +
    "                <label class=\"toggle toggle-royal toggle-balanced\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"data.is_wechat_notify\" ng-checked=\"data.is_wechat_notify == true\" ng-change=\"toggleIsWechatNotify()\">\n" +
    "                    <div class=\"track\">\n" +
    "                        <div class=\"handle\"></div>\n" +
    "                    </div>\n" +
    "                </label>\n" +
    "            </li>\n" +
    "            <a class=\"item item-icon-right\" ui-sref=\"feedback\">\n" +
    "                        用户反馈 <i class=\"icon royal ion-ios-paperplane-outline\"></i> \n" +
    "                    </a>\n" +
    "            <a class=\"item item-icon-right\" ui-sref=\"service-agreement\">\n" +
    "                        用户协议 <i class=\"icon royal ion-ios-paper-outline\"></i> \n" +
    "                    </a>\n" +
    "            <!-- <a class=\"item item-icon-right\" ui-sref=\"help\">\n" +
    "                         帮助 <i class=\"icon ion-help-buoy\"></i>\n" +
    "                    </a>\n" +
    " -->\n" +
    "            <a class=\"item item-icon-right\" ui-sref=\"about\">\n" +
    "                        关于 <i class=\"icon royal ion-ios-star-outline\"></i> \n" +
    "                    </a>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/settings/service-agreement.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/settings/service-agreement.html",
    "<ion-view view-title=\"呱呱二手\" hide-nav-bar=\"true\">\n" +
    "    <ion-header-bar class=\"bar-royal\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button icon-left ion-ios-arrow-left button-clear \" ng-click=\"goBackSettings()\"></button>\n" +
    "        </div>\n" +
    "        <h1 class=\"title\">服务协议</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div class=\"card\" ng-show=\"data.service_agreements==null\">\n" +
    "            <div class=\"item item-text-wrap\">\n" +
    "                加载中...\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"padding\" ng-bind-html='data.service_agreements'>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/tab-account.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tab-account.html",
    "<ion-view hide-nav-bar=\"true\">\n" +
    "    <ion-header-bar class=\"bar-royal\">\n" +
    "        <h1 class=\"title\">我的呱呱二手</h1>\n" +
    "        <div class=\"buttons\">\n" +
    "            <a class=\"button button-clear button-icon ion-ios-gear-outline\" ui-sref=\"settings\"></a>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header\" scroll=\"false\">\n" +
    "        <div id=\"account\">\n" +
    "            <div id=\"profile-info\">\n" +
    "                <img id=\"profile-image\" ng-src='{{data.avatar}}'>\n" +
    "                <h3 id=\"profile-name\">{{data.name}}</h3>\n" +
    "                <!-- <h3 id=\"profile-phone\"><i class=\"icon ion-iphone\"></i> &nbsp;{{data.phone}}</h3> -->\n" +
    "            </div>\n" +
    "            <!-- example https://gist.github.com/Samurais/3cb9498588575f342f1e# -->\n" +
    "            <ion-tabs class=\"tabs-striped tabs-color-royal\">\n" +
    "                <!--  title=\"在售\" -->\n" +
    "                <ion-tab title=\"在售\" badge=\"data.onGoingStuffsBadge||''+0\" badge-style=\"badge-light\" on-select=\"onTabSelected('onGoingStuffs')\">\n" +
    "                    <!-- Tab 1 content -->\n" +
    "                </ion-tab>\n" +
    "                <!--  title=\"下架\" -->\n" +
    "                <ion-tab title=\"下架\" badge=\"data.offShelfStuffsBadge||''+0\" badge-style=\"badge-light\" on-select=\"onTabSelected('offShelfStuffs')\">\n" +
    "                    <!-- Tab 2 content -->\n" +
    "                </ion-tab>\n" +
    "                <!--  title=\"收藏\" -->\n" +
    "                <ion-tab title=\"收藏\" badge=\"data.favoritesStuffsBadge||''+0\" badge-style=\"badge-light\" on-select=\"onTabSelected('favoritesStuffs')\">\n" +
    "                    <!-- Tab 3 content -->\n" +
    "                </ion-tab>\n" +
    "            </ion-tabs>\n" +
    "        </div>\n" +
    "        <!-- <div padding=\"true\" style=\"padding-top:300px;z-index:300\">\n" +
    "Orders fake tab\n" +
    "</div> -->\n" +
    "        <ion-pane id=\"my-stuff-list-container\">\n" +
    "            <ion-scroll id=\"my-stuff-list-scroll\" zooming=\"false\" direction=\"y\">\n" +
    "                <ion-list>\n" +
    "                    <div class=\"card\" ng-if=\"stuffs.length === 0\">\n" +
    "                        <div class=\"item item-text-wrap\">\n" +
    "                            亲，还没有记录呢\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <ion-item on-swipe-left=\"swiped=true\" on-swipe-right=\"swiped=false\" ng-repeat=\"item in stuffs\" class=\"item item-thumbnail-left item-icon-right\" href=\"#/item/{{item._id}}\">\n" +
    "                        <img src=\"{{item.goods_pics[0]}}\" />\n" +
    "                        <i ng-class=\"swiped?'ion-chevron-left':'ion-chevron-right'\" class=\"icon icon-accessory\"></i>\n" +
    "                        <h2>{{item.title}}</h2>\n" +
    "                        <p>¥ {{item.goods_now_price}}</p>\n" +
    "                        <span><i class=\"ion-ios-chatbubble-outline\" style=\"color:red\">{{item.reply_count}}</i>\n" +
    "                        <i class=\"ion-ios-heart-outline assertive\">{{item.collect_count}}</i></span><br/>\n" +
    "                        <!--i class=\"icon ion-chevron-right icon-accessory\"></i-->\n" +
    "                        <!-- need a filter to process create_at  -->\n" +
    "                        <span>{{item.create_at | relativets}} </span>\n" +
    "                        <span ng-if=\"!isFavoriteTab\">\n" +
    "                            <ion-option-button class=\"button-energized\" ng-click=\"editSoldOut(item)\" ng-if=\"item.goods_status === '在售'\">\n" +
    "                                售出\n" +
    "                            </ion-option-button>\n" +
    "                            <ion-option-button class=\"button-assertive\" ng-click=\"editDelete(item)\" ng-if=\"item.goods_status === '下架'\">\n" +
    "                                删除\n" +
    "                            </ion-option-button>\n" +
    "                            <ion-option-button class=\"button-assertive\" ng-click=\"editOffShelf(item)\" ng-if=\"item.goods_status === '在售'\">\n" +
    "                                下架\n" +
    "                            </ion-option-button>\n" +
    "                            <ion-option-button class=\"button-royal\" ng-click=\"editOnShelf(item)\" ng-if=\"item.goods_status === '下架'\">\n" +
    "                                上架\n" +
    "                            </ion-option-button>\n" +
    "                            <ion-option-button class=\"button-calm\" ng-click=\"editDingOnShelf(item)\" ng-if=\"item.goods_status === '在售'\">\n" +
    "                                顶\n" +
    "                            </ion-option-button>\n" +
    "                        </span>\n" +
    "                        <span ng-if=\"isFavoriteTab\">\n" +
    "                            <ion-option-button class=\"button-assertive\" ng-click=\"editUnCollected(item)\">\n" +
    "                                取消收藏\n" +
    "                            </ion-option-button>\n" +
    "                        </span>\n" +
    "                    </ion-item>\n" +
    "                </ion-list>\n" +
    "            </ion-scroll>\n" +
    "        </ion-pane>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/tab-inbox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tab-inbox.html",
    "<ion-view view-title=\"消息中心\">\n" +
    "  <ion-content>\n" +
    "    <ion-list>\n" +
    "      <ion-item class=\"item-remove-animate item-avatar item-icon-right\" ng-repeat=\"message in messages.hasnot_read_messages\" type=\"item-text-wrap\" href=\"#/item/{{message.topic.id}}\">\n" +
    "        <img ng-src=\"{{message.author.avatar}}\">\n" +
    "        <h2>{{message.author.name}}</h2>\n" +
    "        <p>{{message.reply.content}}</p>\n" +
    "        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n" +
    "<!--\n" +
    "        <ion-option-button class=\"button-assertive\" ng-click=\"remove(message)\">\n" +
    "          Delete\n" +
    "        </ion-option-button> -->\n" +
    "      </ion-item>\n" +
    "\n" +
    "      <ion-item class=\"item-remove-animate item-avatar item-icon-right\" ng-repeat=\"message in messages.has_read_messages\" type=\"item-text-wrap\" href=\"#/item/{{message.topic.id}}\">\n" +
    "        <img ng-src=\"{{message.author.avatar}}\">\n" +
    "        <h2>{{message.author.name}}</h2>\n" +
    "        <p>{{message.reply.content}}</p>\n" +
    "        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n" +
    "\n" +
    "      <!--   <ion-option-button class=\"button-assertive\" ng-click=\"remove(message)\">\n" +
    "          Delete\n" +
    "        </ion-option-button> -->\n" +
    "      </ion-item>\n" +
    "      <div class=\"text-center padding\" ng-if=\"doNotHaveMessage\">\n" +
    "        <p>哇，暂时没有新消息</p>\n" +
    "      </div>\n" +
    "    </ion-list>\n" +
    "  </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/tab-index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tab-index.html",
    "<!-- http://ionicframework.com/docs/api/directive/ionSideMenus/ -->\n" +
    "<ion-view hide-nav-bar=\"true\">\n" +
    "    <ion-side-menus>\n" +
    "        <ion-side-menu-content id=\"index\">\n" +
    "          <div class=\"bar bar-header bar-royal\">\n" +
    "              <div class=\"buttons\">\n" +
    "                  <button class=\"button button-icon ion-navicon\" menu-toggle=\"left\"> {{menuTitle}}</button>\n" +
    "              </div>\n" +
    "              <h1 class=\"location title\" ng-click=\"showAddress()\">{{tabTitle}}</h1>\n" +
    "              <i class=\"title-expand icon ion-chevron-down icon-accessory\"></i>\n" +
    "              <input class=\"searchbox\" ng-class=\"showSearch?'expanded':''\" ng-model=\"query\" type=\"text\" placeholder=\"\">\n" +
    "              <a ng-show=\"showSearch\" class=\"button button-icon icon ion-ios-close-empty pull-right\" style=\"right:50px;color:#888;\" ng-click=\"query=''\"></a>\n" +
    "              <a class=\"button button-icon icon ion-ios-search pull-right\" ng-click=\"doSearch(query)\"></a>\n" +
    "          </div>\n" +
    "          <!-- #TODO hide 特价推荐 at this time. https://github.com/arrking/wildfire/issues/123 -->\n" +
    "<!--           <div class=\"bar bar-subheader\">\n" +
    "            <div class=\"button-bar\">\n" +
    "              <a class=\"button button-clear active\">最新发布</a>\n" +
    "              <a class=\"button button-clear\">特价推荐</a>\n" +
    "            </div>\n" +
    "          </div> -->\n" +
    "          <ion-nav-view name=\"menuContent\">\n" +
    "              <ion-content class=\"\" style=\"top:44px\">\n" +
    "              <!-- <ion-content class=\"has-subheader\"> -->\n" +
    "                <ion-refresher ng-if=\"topics.length > 0 || loadError\" pulling-text=\"下拉刷新...\" on-refresh=\"doRefresh()\" >\n" +
    "                </ion-refresher>\n" +
    "                <div class=\"list topics\">\n" +
    "                  <div class=\"item col col-50 no-border\" style=\"height:315px; float:left\" ng-repeat=\"topic in topics\">\n" +
    "                      <div class=\"item item-image\">\n" +
    "                        <a ui-sref=\"item({itemId: topic.id})\">\n" +
    "                          <div class=\"full-image \" style=\"width:100%; height:194px; background:url('{{img_prefix}}{{topic.goods_pics[0]}}') center no-repeat; background-size:cover\"></div>\n" +
    "                          <span class=\"{{topic.goods_quality_degree | badge}}\">{{topic.goods_quality_degree}}</span>\n" +
    "                        </a>\n" +
    "                        <div class=\"text-left padding-left padding-right padding-top\">\n" +
    "                          <a ui-sref=\"item({itemId: topic.id})\" class=\"topics-title\"> <h2> {{topic.title}} </h2></a>\n" +
    "                          <h2 class=\"price assertive\">\n" +
    "                            ￥ {{topic.goods_now_price}}\n" +
    "                            &nbsp;\n" +
    "                            <del>￥ {{topic.goods_pre_price}}</del>\n" +
    "                            <span ng-if='topic.goods_is_bargain' class=\"bargain\">侃</span>\n" +
    "                          </h2>\n" +
    "                          <div class=\"clearfix dot-line\"></div>\n" +
    "                          <div class=\"clearfix\">\n" +
    "                            <div class=\"float-left\"><span class=\"update-time\" am-time-ago=\"topic.update_at\"></span></div>\n" +
    "                            <div class=\"float-right\">\n" +
    "                              <a class=\"button button-clear button-small\" ui-sref=\"item({itemId: topic.id})\">{{topic.reply_count}} <i class=\"icon ion-ios-chatboxes-outline\"> </i></a>\n" +
    "                              <a class=\"button button-clear button-assertive button-small\">{{topic.collect_count}} <i class=\"icon ion-ios-heart\"> </i> </a>\n" +
    "                            </div>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <!--\n" +
    "                  Loading icon of infinte-scroll not showing with collection-repeat\n" +
    "                  https://github.com/driftyco/ionic/issues/2376\n" +
    "                -->\n" +
    "                <ion-infinite-scroll on-infinite=\"loadMore()\" distance=\"10%\" ng-if=\"hasNextPage && !loadError\">\n" +
    "                </ion-infinite-scroll>\n" +
    "                <div class=\"item text-center padding\">\n" +
    "                  <p>{{loadingMsg}}</p>\n" +
    "                </div>\n" +
    "              </ion-content>\n" +
    "          </ion-nav-view>\n" +
    "        </ion-side-menu-content>\n" +
    "        <ion-side-menu side=\"left\">\n" +
    "            <ion-header-bar class=\"bar-stable\">\n" +
    "                <h1 class=\"title\">分类</h1>\n" +
    "            </ion-header-bar>\n" +
    "            <ion-content>\n" +
    "                <ion-list>\n" +
    "                    <ion-item class=\"item topic-name-menu stable-bg {{currentTab==item.value?'activated':''}}\" menu-close ng-click=\"changeSelected(item)\" ng-repeat=\"item in sideMenus\" href=\"#/tab/index/{{item.value}}\">\n" +
    "                        {{item.label}}\n" +
    "                    </ion-item>\n" +
    "                </ion-list>\n" +
    "            </ion-content>\n" +
    "        </ion-side-menu>\n" +
    "    </ion-side-menus>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/tab-maps.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tab-maps.html",
    "<ion-view hide-nav-bar=\"true\">\n" +
    "    <ion-side-menus>\n" +
    "        <!-- for a map, user may drag anywhere, so the menu should not slide out.-->\n" +
    "        <!-- http://ionicframework.com/docs/api/directive/ionSideMenuContent/ -->\n" +
    "        <ion-side-menu-content drag-content=\"false\">\n" +
    "          <div class=\"bar bar-header bar-royal\">\n" +
    "              <div class=\"buttons\">\n" +
    "                  <button class=\"button button-icon ion-navicon\" menu-toggle=\"left\"> {{menuTitle}}</button>\n" +
    "              </div>\n" +
    "              <h1 class=\"location title\" ng-click=\"showFullAddress()\">{{address}}</h1>\n" +
    "              <i class=\"title-expand icon ion-chevron-down icon-accessory\"></i>\n" +
    "              <input class=\"searchbox\" ng-class=\"showSearch?'expanded':''\" ng-model=\"query\" type=\"text\" placeholder=\"\">\n" +
    "              <a ng-show=\"showSearch\" class=\"button button-icon icon ion-ios-close-empty pull-right\" style=\"right:50px;color:#888;\" ng-click=\"query=''\"></a>\n" +
    "              <a class=\"button button-icon icon ion-ios-search pull-right\" ng-click=\"doSearch(query)\"></a>\n" +
    "          </div>\n" +
    "          <ion-nav-view name=\"menuContent\">\n" +
    "              <ion-content>\n" +
    "                <div qq-map topics=\"topics\" state=\"state\"></div>\n" +
    "              </ion-content>\n" +
    "          </ion-nav-view>\n" +
    "        </ion-side-menu-content>\n" +
    "        <ion-side-menu side=\"left\">\n" +
    "            <ion-header-bar class=\"bar-stable\">\n" +
    "                <h1 class=\"title\">分类</h1>\n" +
    "            </ion-header-bar>\n" +
    "            <ion-content>\n" +
    "                <ion-list>\n" +
    "                    <ion-item class=\"item topic-name-menu stable-bg {{currentTab==item.value?'activated':''}}\" menu-close ng-click=\"changeSelected(item)\" ng-repeat=\"item in sideMenus\" href=\"#/tab/maps/{{item.value}}\">\n" +
    "                        {{item.label}}\n" +
    "                    </ion-item>\n" +
    "                </ion-list>\n" +
    "            </ion-content>\n" +
    "        </ion-side-menu>\n" +
    "    </ion-side-menus>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/tab-post.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tab-post.html",
    "<ion-view view-title=\"呱呱二手\">\n" +
    "    <ion-nav-buttons side=\"left\">\n" +
    "        <a class=\"button button-icon icon ion-ios-arrow-back\" href=\"#tab/index\"></a>\n" +
    "    </ion-nav-buttons>\n" +
    "    <ion-content class=\"wf-post-form has-footer\">\n" +
    "        <div class=\"row wf-img-upload\">\n" +
    "            <div class=\"col box\">\n" +
    "                <div class=\"goods-img-holder\" ng-if=\"params.goods_pics.length > 0\">\n" +
    "                    <!--<img ng-src=\"{{params.goods_pics[0]}}\" ng-click=\"removeGoodsPic(params.goods_pics[0])\">\n" +
    "                    </img>-->\n" +
    "                    <div class=\"full-image \" style=\"width:100%; height:160px; background:url('{{params.goods_pics[0]}}') center no-repeat; background-size:cover\"></div>\n" +
    "                    <span class=\"ion-ios-close\" ng-click=\"removeGoodsPic(params.goods_pics[0])\"></span>\n" +
    "                </div>\n" +
    "                <!-- <span class=\"goods-pic-del-badge\" ng-if=\"params.goods_pics.length > 0\"></span> -->\n" +
    "            </div>\n" +
    "            <div class=\"col group nopadding\">\n" +
    "                <div class=\"row nopadding\">\n" +
    "                    <div class=\"col box\">\n" +
    "                        <div class=\"goods-img-holder\" ng-if=\"params.goods_pics.length > 1\">\n" +
    "                            <!--<img ng-src=\"{{params.goods_pics[1]}}\" ng-click=\"removeGoodsPic(params.goods_pics[1])\" />-->\n" +
    "                            <div class=\"full-image \" style=\"width:100%; height:78px; background:url('{{params.goods_pics[1]}}') center no-repeat; background-size:cover\"></div>\n" +
    "                            <span class=\"ion-ios-close\" ng-click=\"removeGoodsPic(params.goods_pics[1])\"></span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col box\">\n" +
    "                        <div class=\"goods-img-holder\" ng-if=\"params.goods_pics.length > 2\">\n" +
    "                            <!--<img ng-src=\"{{params.goods_pics[2]}}\" ng-click=\"removeGoodsPic(params.goods_pics[2])\" />-->\n" +
    "                            <div class=\"full-image \" style=\"width:100%; height:78px; background:url('{{params.goods_pics[2]}}') center no-repeat; background-size:cover\"></div>\n" +
    "                            <span class=\"ion-ios-close\" ng-click=\"removeGoodsPic(params.goods_pics[2])\"></span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row nopadding\">\n" +
    "                    <div class=\"col box\">\n" +
    "                        <div class=\"goods-img-holder\" ng-if=\"params.goods_pics.length > 3\">\n" +
    "                            <!--<img ng-src=\"{{params.goods_pics[3]}}\" ng-click=\"removeGoodsPic(params.goods_pics[3])\" />-->\n" +
    "                            <div class=\"full-image \" style=\"width:100%; height:78px; background:url('{{params.goods_pics[3]}}') center no-repeat; background-size:cover\"></div>\n" +
    "                            <span class=\"ion-ios-close\" ng-click=\"removeGoodsPic(params.goods_pics[3])\"></span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col box\" ng-if=\"params.goods_pics.length > 4\">\n" +
    "                        <div class=\"goods-img-holder\">\n" +
    "                            <!--<img ng-src=\"{{params.goods_pics[4]}}\" ng-click=\"removeGoodsPic(params.goods_pics[4])\" />-->\n" +
    "                            <div class=\"full-image \" style=\"width:100%; height:78px; background:url('{{params.goods_pics[4]}}') center no-repeat; background-size:cover\"></div>\n" +
    "                            <span class=\"ion-ios-close\" ng-click=\"removeGoodsPic(params.goods_pics[4])\"></span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!-- at most, there are five images -->\n" +
    "                    <!-- if reach five images, hide the upload button -->\n" +
    "                    <div ng-if=\"params.goods_pics.length < 5\" class=\"col box upload\" id=\"uploadImg\" ng-click=\"uploadImage()\">\n" +
    "                        <i class=\"icon ion-plus\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <ion-list>\n" +
    "            <ion-item>\n" +
    "                <ul class=\"tag-list\">\n" +
    "                    <li ng-repeat=\"item in tagList\" ng-class=\"item.value === params.tab ? 'active' : ''\">\n" +
    "                        <a href=\"javascript:void(0)\" ng-click=\"changeTab(item.value)\">{{item.label}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </ion-item>\n" +
    "            <ion-item>\n" +
    "                <ul class=\"quality-list\">\n" +
    "                    <li ng-repeat=\"item in qualityList\" ng-class=\"item === params.quality ? 'active' : ''\">\n" +
    "                        <a href=\"javascript:void(0)\" ng-click=\"changeQuality(item)\">{{item}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </ion-item>\n" +
    "        </ion-list>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col\">\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <span class=\"input-label\">转让价</span>\n" +
    "                    <input id=\"gprice\" type=\"text\" placeholder=\"￥\" ng-model=\"params.goods_now_price\">\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"col\">\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <span class=\"input-label\">原价</span>\n" +
    "                    <input type=\"text\" placeholder=\"￥(非必填)\" ng-model=\"params.goods_pre_price\">\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"item item-toggle\">\n" +
    "            <span>是否接受侃价</span>\n" +
    "            <label class=\"toggle toggle-royal\">\n" +
    "                <input type=\"checkbox\" ng-model=\"params.goods_is_bargain\">\n" +
    "                <div class=\"track\">\n" +
    "                    <div class=\"handle\"></div>\n" +
    "                </div>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"item item-input\">\n" +
    "            <span class=\"input-label\">宝贝名称</span>\n" +
    "            <input id=\"gtitle\" ng-model=\"params.title\" type=\"text\" placeholder=\"输入大于五个字的标题\">\n" +
    "        </div>\n" +
    "        <div class=\"item item-icon-right\" ng-click=\"openGoodsDespModal()\">\n" +
    "            <span>宝贝描述</span>\n" +
    "            <span class=\"item-content\" style=\"padding-left:45px;\">{{params.content}}</span>\n" +
    "            <i class=\"icon ion-chevron-right icon-accessory\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"item item-icon-right\" href=\"javascript:void(0)\" ng-click=\"showChangeLocationModal()\">\n" +
    "            <span>交易地点</span>\n" +
    "            <span class=\"item-content\" style=\"padding-left:45px;\">{{params.goods_exchange_location.user_edit_address || '点击选择地址'}}</span>\n" +
    "            <i class=\"icon ion-location icon-accessory\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"padding\">\n" +
    "            <button class=\"button button-block button-royal\" ng-click=\"submitGoods()\">确定发布</button>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("templates/tabs.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tabs.html",
    "<!--\n" +
    "Create tabs with an icon and label, using the tabs-positive style.\n" +
    "Each tab's child <ion-nav-view> directive will have its own\n" +
    "navigation history that also transitions its views in and out.\n" +
    "-->\n" +
    "<ion-tabs class=\"tabs-icon-only tabs-color-royal\">\n" +
    "\n" +
    "  <!-- Index Tab -->\n" +
    "  <ion-tab title=\"Index\" icon=\"ion-ios-home\" href=\"#/tab/index/\">\n" +
    "    <ion-nav-view name=\"tab-index\"></ion-nav-view>\n" +
    "  </ion-tab>\n" +
    "\n" +
    "  <!-- Map Tab -->\n" +
    "  <ion-tab title=\"Map\" icon=\"ion-ios-location\" href=\"#/tab/maps/\">\n" +
    "    <ion-nav-view name=\"tab-maps\"></ion-nav-view>\n" +
    "  </ion-tab>\n" +
    "\n" +
    "  <!-- Post Tab -->\n" +
    "  <ion-tab title=\"Post\" icon=\"frog-icon frog1\" href=\"#/post\">\n" +
    "    <ion-nav-view name=\"tab-post\"></ion-nav-view>\n" +
    "  </ion-tab>\n" +
    "\n" +
    "  <!-- Inbox Tab -->\n" +
    "  <ion-tab title=\"Inbox\" icon=\"ion-ios-email\" href=\"#/tab/inbox\" badge=\"message_not_read_count\" badge-style=\"badge-assertive\">\n" +
    "    <ion-nav-view name=\"tab-inbox\">\n" +
    "    </ion-nav-view>\n" +
    "  </ion-tab>\n" +
    "\n" +
    "  <!-- Account Tab -->\n" +
    "  <ion-tab title=\"Acount\" icon=\"ion-ios-person\" href=\"#/tab/account\">\n" +
    "    <ion-nav-view name=\"tab-account\"></ion-nav-view>\n" +
    "  </ion-tab>\n" +
    "\n" +
    "\n" +
    "</ion-tabs>\n" +
    "");
}]);
