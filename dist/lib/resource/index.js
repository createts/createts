"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ResourceRegistry = require("./ResourceRegistry");

Object.keys(_ResourceRegistry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ResourceRegistry[key];
    }
  });
});

var _ImageClip = require("./ImageClip");

Object.keys(_ImageClip).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ImageClip[key];
    }
  });
});