"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Choice = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const choiceSchema = new mongoose_2.Schema({
    name: {
        type: String,
        required: [true, "Ce choix mérite un nom"]
    },
    content: {
        type: String,
        required: [true, "Ce choix mérite un contenu"]
    },
    nomImg: {
        type: String,
    },
    choices: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Choice"
    }
});
exports.Choice = (0, mongoose_2.model)("Choice", choiceSchema);
