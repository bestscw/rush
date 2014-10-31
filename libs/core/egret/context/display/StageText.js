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
var egret;
(function (egret) {
    /**
    * @class egret.StageText
    * @classdesc
    * @extends egret.HashObject
    */
    var StageText = (function (_super) {
        __extends(StageText, _super);
        function StageText() {
            _super.call(this);
            this._multiline = false;
            this._maxChars = 0;
        }
        /**
        * @method egret.StageText#getText
        * @returns {string}
        */
        StageText.prototype._getText = function () {
            return null;
        };

        /**
        * @method egret.StageText#setText
        * @param value {string}
        */
        StageText.prototype._setText = function (value) {
        };

        /**
        * @method egret.StageText#setTextType
        * @param type {string}
        */
        StageText.prototype._setTextType = function (type) {
        };

        /**
        * @method egret.StageText#getTextType
        * @returns {string}
        */
        StageText.prototype._getTextType = function () {
            return null;
        };

        /**
        * @method egret.StageText#open
        * @param x {number}
        * @param y {number}
        * @param width {number}
        * @param height {number}
        */
        StageText.prototype._open = function (x, y, width, height) {
            if (typeof width === "undefined") { width = 160; }
            if (typeof height === "undefined") { height = 21; }
        };

        /**
        * @method egret.StageText#add
        */
        StageText.prototype._show = function () {
        };

        /**
        * @method egret.StageText#remove
        */
        StageText.prototype._remove = function () {
        };

        StageText.prototype._hide = function () {
        };

        StageText.prototype._draw = function () {
        };

        StageText.prototype._addListeners = function () {
        };

        StageText.prototype._removeListeners = function () {
        };

        StageText.prototype.changePosition = function (x, y) {
        };

        StageText.prototype.changeSize = function (width, height) {
        };

        StageText.prototype.setSize = function (value) {
        };

        StageText.prototype.setTextColor = function (value) {
        };

        StageText.prototype.setTextFontFamily = function (value) {
        };

        StageText.prototype.setWidth = function (value) {
        };

        StageText.prototype.setHeight = function (value) {
        };

        StageText.prototype._setMultiline = function (value) {
            this._multiline = value;
        };

        StageText.create = function () {
            return null;
        };
        return StageText;
    })(egret.EventDispatcher);
    egret.StageText = StageText;
    StageText.prototype.__class__ = "egret.StageText";
})(egret || (egret = {}));
