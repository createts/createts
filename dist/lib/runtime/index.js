"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Runtime = require("./Runtime");

Object.keys(_Runtime).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Runtime[key];
    }
  });
});

var _WebpageRuntime = require("./WebpageRuntime");

Object.keys(_WebpageRuntime).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WebpageRuntime[key];
    }
  });
});

var _WechatMiniGameRuntime = require("./WechatMiniGameRuntime");

Object.keys(_WechatMiniGameRuntime).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WechatMiniGameRuntime[key];
    }
  });
});

var _WechatMiniProgramRuntime = require("./WechatMiniProgramRuntime");

Object.keys(_WechatMiniProgramRuntime).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WechatMiniProgramRuntime[key];
    }
  });
});