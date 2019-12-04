"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextMessageTargetMode;
(function (TextMessageTargetMode) {
    /** target is a client */
    TextMessageTargetMode[TextMessageTargetMode["CLIENT"] = 1] = "CLIENT";
    /** target is a channel */
    TextMessageTargetMode[TextMessageTargetMode["CHANNEL"] = 2] = "CHANNEL";
    /** target is a virtual server */
    TextMessageTargetMode[TextMessageTargetMode["SERVER"] = 3] = "SERVER";
})(TextMessageTargetMode = exports.TextMessageTargetMode || (exports.TextMessageTargetMode = {}));
