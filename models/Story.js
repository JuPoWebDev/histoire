"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const storySchema = new mongoose_2.Schema({
    name: {
        type: String,
        required: [true, "Toute histoire mérite un nom"],
    },
    content: {
        type: String,
        required: [true, "Toute histoire mérite un contenu"],
    },
    choices: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Choice"
    }
});
exports.Story = (0, mongoose_2.model)("Story", storySchema);
