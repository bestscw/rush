/**
* Copyright (c) 2014,Egret-Labs.org
* All rights reserved.
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of the Egret-Labs.org nor the
*       names of its contributors may be used to endorse or promote products
*       derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.ration = 0;
        this.speed = 500;
        this.ballWidth = 12;
        this.ballMoveSpeed = 3;
        this.sideWidth = 200;
        this.stageW = 0;
        this.stageH = 0;
        this._colors = 'FF0000,00BFFF,32CD32,00FF00';
        this._colorsLen = 0;
        this._colorarr = [];
        this.ballColor = '';
        this.touchColor = '0xFF0000';
        this.colorOrder = [];
        this.platform = '';
        this.nScore = 0;
        this.nTopScore = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };

    /**
    * 配置文件加载完成,开始预加载preload资源组。
    */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };

    /**
    * preload资源组加载完成
    */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene2();
        }
    };

    /**
    * preload资源组加载进度
    */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };

    Main.prototype.roll = function () {
        this.ration += 90;
        var first = this.colorOrder.shift();
        this.colorOrder.push(first);

        var name = '';
        if (first == '0xFF0000') {
            this.touchColor = '0x00BFFF';
            name = 'blue';
        } else if (first == '0x00BFFF') {
            this.touchColor = '0x32CD32';
            name = 'deepGreen';
        } else if (first == '0x32CD32') {
            this.touchColor = '0x00FF00';
            name = 'green';
        } else if (first == '0x00FF00') {
            this.touchColor = '0xFF0000';
            name = 'red';
        }
        console.log('roll:' + name);

        this.tw = egret.Tween.get(this.colorContainer, { loop: false });
        this.tw.to({ rotation: this.ration }, this.speed).call(this.removeTw, this);
    };

    Main.prototype.removeTw = function () {
        egret.Tween.removeTweens(this.tw);
    };

    Main.prototype.showMaskPanel = function () {
        this.addChild(this.maskContainer);
    };

    Main.prototype.gameViewUpdate = function () {
        if (this.getChildByName('ball')) {
            this.ball.y += this.ballMoveSpeed;
            if (this._hitTest(this.ball, this.mainContainer)) {
                console.log('ball' + this.ballColor + ",touched" + this.touchColor);

                if (this.ballColor == this.touchColor) {
                    this.nScore += 1;
                    this.txtScore.text = String(this.nScore);
                    this.clickSound.play();
                    this.removeChild(this.ball);
                } else {
                    var infoKey = "gameRush";
                    var best = Number(window.localStorage.getItem(infoKey));
                    var curr = Number(this.nScore);
                    if (curr > best || best == 0) {
                        this.txtTop.text = String(curr);
                        window.localStorage.setItem(infoKey, String(curr));
                    }

                    var str = '我在【转你妹】中一口气转了' + this.nScore + '次，快来超越我吧！';
                    shareGame(str);

                    this.gameStop();
                    this.removeChild(this.ball);
                    this.showMaskPanel();
                }
            }
        } else {
            var ball = new egret.Sprite();
            this.ball = ball;
            var colorIndex = Math.floor(Math.random() * this._colorsLen);
            this.ballColor = this._colorarr[colorIndex];
            ball.graphics.beginFill(parseInt(this._colorarr[colorIndex], 16), 1);
            ball.graphics.drawCircle(0, 0, this.ballWidth);
            ball.graphics.endFill();
            ball.name = 'ball';
            ball.x = (this.stageW - this.ballWidth) / 2;
            ;
            ball.y = -this.ballWidth;
            this.addChildAt(ball, 0);
        }
    };

    /**基于矩形的碰撞检测*/
    Main.prototype._hitTest = function (obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;

        return rect1.intersects(rect2);
    };

    Main.prototype.gameStart = function () {
        this.removeChild(this.btnStart);
        this.addChild(this.txtScore);
        this.addChild(this.txtTop);
        this.addChild(this.mainContainer);
        this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
    };

    Main.prototype.gameReply = function () {
        this.txtScore.text = '0';
        this.nScore = 0;
        this.removeChild(this.maskContainer);
        this.removeChild(this.mainContainer);
        this.addChild(this.mainContainer);
        this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
    };

    Main.prototype.gameStop = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
    };

    // 初始化游戏场景元素
    Main.prototype.createGameScene2 = function () {
        this.getPlatform();
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;

        if (this.platform == "window") {
            var side = this.stageW * 0.4;
        } else {
            var side = this.stageW * 0.6;
        }
        var h = side / 2;
        this.ballWidth = this.stageW * 0.03;
        this.sideWidth = side;

        this.btnStart = this.createBitmapByName("btnStart"); //开始按钮
        this.btnStart.x = (this.stageW - this.btnStart.width) / 2; //居中定位
        this.btnStart.y = (this.stageH - this.btnStart.height) / 2; //居中定位
        this.btnStart.touchEnabled = true; //开启触碰
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this); //点击按钮开始游戏
        this.addChild(this.btnStart);

        var arr = this._colors.split(',');
        this._colorsLen = arr.length;

        for (var i = 0; i < this._colorsLen; i++) {
            this._colorarr.push('0x' + arr[i]);
        }

        this.colorOrder = this._colorarr;
        this.clickSound = RES.getRes("click");

        var spr1 = new egret.Sprite();
        spr1.graphics.beginFill(0xffffff, 1);
        spr1.graphics.drawRect(0, 0, side, side);
        spr1.x = (this.stageW - this.sideWidth) / 2;
        spr1.y = this.stageH - this.sideWidth - 80;
        spr1.width = side;
        spr1.height = side;
        spr1.graphics.endFill();
        this.mainContainer = spr1;

        this.btnReply = this.createBitmapByName("btnReply"); //开始按钮t
        this.btnReply.x = (this.stageW - this.btnStart.width) / 2; //居中定位
        this.btnReply.y = (this.stageH - this.btnStart.height) / 2; //居中定位
        this.btnReply.touchEnabled = true; //开启触碰
        this.btnReply.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameReply, this); //点击按钮开始游戏

        var mask = new egret.Sprite();
        mask.graphics.beginFill(0x000000, 1);
        mask.graphics.drawRect(0, 0, this.stageW, this.stageH);
        mask.x = 0;
        mask.y = 0;
        mask.alpha = 0.5;
        mask.anchorX = 0;
        mask.anchorY = 0;
        mask.width = this.stageW;
        mask.height = this.stageH;
        mask.graphics.endFill();
        mask.addChild(this.btnReply);
        this.maskContainer = mask;

        if (this.platform != "window") {
            var txtShare = new egret.TextField();
            txtShare.width = this.stageW;
            txtShare.height = this.stageH * 0.4;
            txtShare.size = 40;
            txtShare.fontFamily = "微软雅黑";
            txtShare.text = '分享到微信';
            txtShare.textColor = 0x666666;
            txtShare.x = this.stageW * 0.1;
            txtShare.y = this.stageH * 0.65;
            txtShare.textAlign = egret.HorizontalAlign.CENTER;
            txtShare.verticalAlign = egret.VerticalAlign.MIDDLE;
            txtShare.touchEnabled = true;
            txtShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareWeixin, this);
            mask.addChild(txtShare);
        }

        var txtScore = new egret.TextField();
        txtScore.width = this.stageW / 4;
        txtScore.height = this.stageH * 0.4;
        txtScore.size = 80;
        txtScore.fontFamily = "微软雅黑";
        txtScore.text = '0';
        txtScore.textColor = 0x666666;
        txtScore.x = this.stageW * 0.2;
        txtScore.y = 0;
        txtScore.textAlign = egret.HorizontalAlign.CENTER;
        txtScore.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.txtScore = txtScore;

        var txtTop = new egret.TextField();
        txtTop.width = this.stageW / 4;
        txtTop.height = this.stageH * 0.4;
        txtTop.size = 80;
        txtTop.fontFamily = "微软雅黑";
        txtTop.text = '0';
        txtTop.textColor = 0x666666;
        txtTop.x = this.stageW * 0.6;
        txtTop.y = 0;
        txtTop.textAlign = egret.HorizontalAlign.CENTER;
        txtTop.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.txtTop = txtTop;

        var infoKey = "gameRush";
        var best = Number(window.localStorage.getItem(infoKey));
        this.txtTop.text = String(best);

        var spr = new egret.Sprite();
        spr.graphics.beginFill(0x00ff00, 1);
        spr.graphics.drawRect(0, 0, side, side);
        spr.x = side / 2;
        spr.y = side / 2;
        spr.anchorX = 0.5;
        spr.anchorY = 0.5;
        spr.width = side;
        spr.height = side;
        spr.touchEnabled = true;
        spr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.roll, this, false);
        spr.graphics.endFill();
        this.colorContainer = spr;

        var delta1 = new egret.Sprite();
        delta1.graphics.beginFill(0xFF0000, 1);
        delta1.graphics.moveTo(0, 0);
        delta1.graphics.lineTo(side, 0);
        delta1.graphics.lineTo(side / 2, h);
        delta1.graphics.lineTo(0, 0);
        delta1.graphics.endFill();
        spr.addChild(delta1);

        var delta2 = new egret.Sprite();
        delta2.graphics.beginFill(0x00BFFF, 1);
        delta2.graphics.moveTo(0, 0);
        delta2.graphics.lineTo(side / 2, h);
        delta2.graphics.lineTo(0, side);
        delta2.graphics.endFill();
        spr.addChild(delta2);

        var delta3 = new egret.Sprite();
        delta3.graphics.beginFill(0x32CD32, 1);
        delta3.graphics.moveTo(0, side);
        delta3.graphics.lineTo(side / 2, h);
        delta3.graphics.lineTo(side, side);
        delta3.graphics.endFill();
        spr.addChild(delta3);

        var delta4 = new egret.Sprite();
        delta4.graphics.beginFill(0x00ff00, 1);
        delta4.graphics.moveTo(side, side);
        delta4.graphics.lineTo(side / 2, h);
        delta4.graphics.lineTo(side, 0);
        delta4.graphics.endFill();
        spr.addChild(delta4);

        spr1.addChild(spr);

        var a = new egret.Bitmap;
        a.texture = RES.getRes('shareTips');
        a.width = this.stageW;
        a.height = this.stageH;
        a.touchEnabled = true;
        a.alpha = 50;
        a.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeShareTips, this);
        this.shareTips = a;
    };

    Main.prototype.shareWeixin = function () {
        this.addChild(this.shareTips);
    };

    Main.prototype.getPlatform = function () {
        var ua = navigator.userAgent.toLowerCase();
        var start = ua.indexOf('(');
        var end = ua.indexOf(')');
        var type = ua.substr((start + 1), 6);

        var ua = navigator.userAgent.toLowerCase();
        var start = ua.indexOf('(');
        var end = ua.indexOf(')');
        var type = ua.substr((start + 1), 6);
        this.platform = type;
    };

    Main.prototype.closeShareTips = function () {
        if (this.shareTips.parent) {
            this.shareTips.parent.removeChild(this.shareTips);
        }
    };

    Main.prototype.share = function () {
        WeixinApi.ready(function (Api) {
            // 微信分享的数据
            var wxData = {
                "appId": "",
                "imgUrl": 'http://app.easymobi.cn/game/rush/icon.jpg',
                "link": 'http://www.4399.com/flash/145328_2.htm',
                "desc": '快来玩【转你妹】吧！来试试你能转多少次',
                "title": "和我一起玩[转你妹]吧!"
            };

            // 分享的回调
            var wxCallbacks = {
                // 分享操作开始之前
                ready: function () {
                    // 你可以在这里对分享的数据进行重组
                    //alert("准备分享");
                },
                // 分享被用户自动取消
                cancel: function (resp) {
                    // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
                    //alert("分享被取消");
                },
                // 分享失败了
                fail: function (resp) {
                    // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
                    //alert("分享失败");
                },
                // 分享成功
                confirm: function (resp) {
                    //创建GET请求
                    //alert("分享成功");
                },
                // 整个分享过程结束
                all: function (resp) {
                    // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
                    //alert("分享结束");
                }
            };

            // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
            Api.shareToFriend(wxData, wxCallbacks);

            // 点击分享到朋友圈，会执行下面这个代码
            Api.shareToTimeline(wxData, wxCallbacks);

            // 点击分享到腾讯微博，会执行下面这个代码
            Api.shareToWeibo(wxData, wxCallbacks);
        });
    };
    Main.prototype.weixinShare = function (str) {
        WeixinApi.ready(function (Api) {
            // 微信分享的数据
            var wxData = {
                "appId": "",
                "imgUrl": 'http://app.easymobi.cn/game/rush/icon.jpg',
                "link": 'http://www.4399.com/flash/145328_2.htm',
                "desc": str,
                "title": "和我一起玩[转你妹]吧!"
            };

            // 分享的回调
            var wxCallbacks = {
                // 分享操作开始之前
                ready: function () {
                    // 你可以在这里对分享的数据进行重组
                    //alert("准备分享");
                },
                // 分享被用户自动取消
                cancel: function (resp) {
                    // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
                    //alert("分享被取消");
                },
                // 分享失败了
                fail: function (resp) {
                    // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
                    //alert("分享失败");
                },
                // 分享成功
                confirm: function (resp) {
                    //创建GET请求
                    //alert("分享成功");
                },
                // 整个分享过程结束
                all: function (resp) {
                    // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
                    //alert("分享结束");
                }
            };

            // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
            Api.shareToFriend(wxData, wxCallbacks);

            // 点击分享到朋友圈，会执行下面这个代码
            Api.shareToTimeline(wxData, wxCallbacks);

            // 点击分享到腾讯微博，会执行下面这个代码
            Api.shareToWeibo(wxData, wxCallbacks);
        });
    };

    /**
    * 创建游戏场景
    */
    Main.prototype.createGameScene = function () {
        var sky = this.createBitmapByName("bgImage");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, stageH);
        topMask.graphics.endFill();
        topMask.width = stageW;
        topMask.height = stageH;
        this.addChild(topMask);

        var icon = this.createBitmapByName("egretIcon");
        icon.anchorX = icon.anchorY = 0.5;
        this.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 60;
        icon.scaleX = 0.55;
        icon.scaleY = 0.55;

        var colorLabel = new egret.TextField();
        colorLabel.x = stageW / 2;
        colorLabel.y = stageH / 2 + 50;
        colorLabel.anchorX = colorLabel.anchorY = 0.5;
        colorLabel.textColor = 0xffffff;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 20;
        this.addChild(colorLabel);

        var textContainer = new egret.Sprite();
        textContainer.anchorX = textContainer.anchorY = 0.5;
        this.addChild(textContainer);
        textContainer.x = stageW / 2;
        textContainer.y = stageH / 2 + 100;
        textContainer.alpha = 0;

        this.textContainer = textContainer;

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        RES.getResAsync("description", this.startAnimation, this);
    };

    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };

    /**
    * 描述文件加载成功，开始播放动画
    */
    Main.prototype.startAnimation = function (result) {
        var textContainer = this.textContainer;
        var count = -1;
        var self = this;
        var change = function () {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var lineArr = result[count];

            self.changeDescription(textContainer, lineArr);

            var tw = egret.Tween.get(textContainer);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    };

    /**
    * 切换描述内容
    */
    Main.prototype.changeDescription = function (textContainer, lineArr) {
        textContainer.removeChildren();
        var w = 0;
        for (var i = 0; i < lineArr.length; i++) {
            var info = lineArr[i];
            var colorLabel = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 40;
            textContainer.addChild(colorLabel);

            w += colorLabel.width;
        }
    };
    return Main;
})(egret.DisplayObjectContainer);
Main.prototype.__class__ = "Main";
