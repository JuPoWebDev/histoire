"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// On créée express, qui charge le module express
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Story_1 = require("./models/Story");
const Choice_1 = require("./models/Choice");
// On créée app, une instance d'express
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//mongoose.connect('mongodb+srv://jerkyrio:MlbwEqOrEepNrETC@cluster0.xlktn.mongodb.net/histoire_tichat?retryWrites=true&w=majority');
mongoose_1.default.connect('mongodb://localhost:27017/histoire_tichat');
function checkChoice(res, element, story, choix) {
    if (Array.isArray(element.choices)) {
        for (let i = 0; i < element.choices.length; i++) {
            if (element.choices[i].name === choix) {
                let choice_find = element.choices[i];
                res.status(200).json({
                    message: "choix trouvéééééé",
                    choix: choice_find.name,
                    content: choice_find.content,
                    choices: choice_find.choices
                });
            }
        }
        for (let i = 0; i < element.choices.length; i++) {
            if (Array.isArray(element.choices)) {
                checkChoice(res, element.choices[i], story, choix);
            }
        }
    }
}
function addChoice(res, element, story, choix, newChoice) {
    var _a;
    try {
        console.log("enter addchoice");
        console.log(element);
        console.log(element);
        if (Array.isArray(element.choices)) {
            if (element.choices.length > 0) {
                for (let i = 0; i < element.choices.length; i++) {
                    console.log(element);
                    console.log(element.choices[i]);
                    console.log(choix);
                    if (element.choices[i].name === choix) {
                        let choice_find = element.choices[i];
                        (_a = choice_find.choices) === null || _a === void 0 ? void 0 : _a.push(newChoice);
                        res.status(200).json({ story, choice_find });
                    }
                    else {
                        console.log("no element.choices[i].name === choix");
                    }
                }
                for (let i = 0; i < element.choices.length; i++) {
                    if (Array.isArray(element.choices)) {
                        addChoice(res, element.choices[i], story, choix, newChoice);
                    }
                }
            }
            else {
                console.log("element choices", element.choices);
                if (element.choices) {
                    // ici ! a modif ! 
                    element.choices.push(newChoice);
                    console.log("element", element);
                    newChoice.save();
                    story.populate("Choice");
                    story.save();
                    res.status(201).json(story);
                }
            }
        }
    }
    catch (err) {
        res.json(err);
    }
}
// On crée une route GET sur la route "/" : une requête GET est envoyé lorsqu'on valide une URL
app.get("/", (req, res) => {
    try {
        const histoire = req.query.histoire;
        const choix = req.query.choix;
        if (histoire) {
            if (choix) {
                Story_1.Story.find({ name: histoire }, (result_story) => {
                    if (result_story) {
                        checkChoice(res, result_story, result_story, choix);
                    }
                });
            }
            else {
                res.status(202).json({
                    message: "Voici l'histoire demandé",
                    histoire: histoire,
                });
            }
        }
        else {
            res.status(404).json({
                message: "Histoire inexistante"
            });
        }
        res.status(404).json({
            message: "pas d'histoire demandé",
            histoire: histoire,
            choix: choix
        });
    }
    catch (err) {
        res.status(400).json(err);
    }
});
/**
 *
 */
app.post("/create-choice", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const histoire = req.body.histoire;
        const choix = req.body.choix;
        const newChoice = new Choice_1.Choice({
            name: req.body.name,
            content: req.body.content,
            nomImg: req.body.nomImg,
            choices: []
        });
        console.log("newchoic1", newChoice);
        if (histoire) {
            console.log("histoire exist");
            if (choix) {
                console.log("choix exist");
                const result_story = yield Story_1.Story.findOne({ name: histoire }).populate("choices");
                if (result_story) {
                    addChoice(res, result_story, result_story, choix, newChoice);
                }
            }
            else {
                console.log("in other");
                res.status(404).json({
                    message: "Le choix ciblé n'existe pas"
                });
            }
        }
        else {
            res.status(404).json({
                message: "L'histoire n'existe pas"
            });
        }
    }
    catch (err) {
        console.log("in catch");
        res.status(400).json(err);
    }
}));
app.post("/create-story", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const story_name = req.body.name;
        const story_content = req.body.content;
        if (story_name && story_content) {
            const checkStoryExist = yield Story_1.Story.findOne({ name: story_name });
            if (checkStoryExist !== null) {
                res.status(400).json({
                    message: "Une histoire avec ce nom existe déja"
                });
            }
            else {
                const newStory = new Story_1.Story({
                    name: req.body.name,
                    content: req.body.content,
                    choices: []
                });
                yield newStory.save();
                res.status(201).json(newStory);
            }
        }
        else {
            res.json({
                message: "no name or content"
            });
        }
    }
    catch (err) {
        res.status(400).json({
            error: true,
            err: err
        });
    }
}));
app.listen(3000, () => {
    console.log("Server start");
});
