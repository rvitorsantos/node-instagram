"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var Stream = (function (_super) {
    __extends(Stream, _super);
    function Stream(instagram, endpoint, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.instagram = instagram;
        _this.endpoint = endpoint;
        _this.runOnCreation =
            options.runOnCreation === false ? options.runOnCreation : true;
        _this.interval = options.interval || 10000;
        _this.minTagId = options.minTagId;
        _this.intervalId = null;
        _this.cache = [];
        _this.accessToken = options.accessToken;
        if (_this.runOnCreation) {
            _this.start();
        }
        return _this;
    }
    Stream.prototype.start = function () {
        this.startDate = new Date();
        this.makeRequest();
        this.stop();
        this.intervalId = setInterval(this.makeRequest.bind(this), this.interval);
    };
    Stream.prototype.stop = function () {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };
    Stream.prototype.makeRequest = function () {
        var _this = this;
        var params = {
            accessToken: this.accessToken,
        };
        if (this.minTagId) {
            params.min_tag_id = this.minTagId;
        }
        this.instagram
            .get(this.endpoint, params)
            .then(function (data) {
            var _a;
            if (data.data && data.data.length > 0) {
                var newPosts = data.data.filter(function (post) { return _this.cache.indexOf(post.id) === -1; });
                (_a = _this.cache).push.apply(_a, newPosts.map(function (post) { return post.id; }));
                newPosts = newPosts.filter(function (post) { return _this.startDate < new Date(post.created_time * 1000); });
                if (data.pagination.min_tag_id) {
                    _this.minTagId = data.pagination.min_tag_id;
                    _this.cache = [];
                }
                if (newPosts.length > 0) {
                    _this.emit('messages', newPosts);
                }
            }
        })
            .catch(function (err) {
            _this.emit('error', err.error || err);
        });
    };
    return Stream;
}(events_1.EventEmitter));
exports.default = Stream;
//# sourceMappingURL=stream.js.map