// On créée express, qui charge le module express
import express from "express";
import mongoose from "mongoose";
import { Story, IStory } from "./models/Story";
import { Choice, IChoice } from "./models/Choice";



// On créée app, une instance d'express
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/histoire_tichat');

function checkChoice(res: express.Response, element:IChoice|IStory, story:IStory, choix:string|undefined,) {
    if(Array.isArray(element.choices)) {
        for(let i = 0; i<element.choices.length; i++) {
            if(element.choices[i].name === choix) {
                let choice_find = element.choices[i]
                res.status(200).json({
                    message:"choix trouvéééééé",
                    choix:choice_find.name,
                    content:choice_find.content,
                    choices:choice_find.choices
                })
            }
        }

        for(let i =0 ; i< element.choices.length ; i++) {
            if(Array.isArray(element.choices)) {
            checkChoice(res, element.choices[i],story, choix)
        }
        }
    }
}

function addChoice(res: express.Response, element:IChoice|IStory, story:IStory, choix:string|undefined, newChoice:IChoice) {
    try{
    console.log("enter addchoice");
    console.log(element);
    
    console.log(element);
    
    if(Array.isArray(element.choices)) {
        if(element.choices.length>0) {

            for(let i = 0; i<element.choices.length; i++) {
                console.log(element)
                console.log(element.choices[i])
                console.log(choix)
                if(element.choices[i].name === choix) {
                    let choice_find = element.choices[i]
                    choice_find.choices?.push(newChoice)
                    res.status(200).json({story, choice_find})
                } else {
                    console.log("no element.choices[i].name === choix");
                    
                }
            }

            for(let i =0 ; i< element.choices.length ; i++) {
                if(Array.isArray(element.choices)) {
                addChoice(res, element.choices[i],story, choix, newChoice)
                }
            } 
        } else {
            console.log("element choices", element.choices)
            if(element.choices) {
                // ici ! a modif ! 
                element.choices.push(newChoice)
                console.log("lement", element);
                newChoice.save()
                story.populate("Choice");
                story.save();
                res.status(201).json(story);
            }
        }
    } 
    } catch(err) {
        res.json(err)
    }
}

// On crée une route GET sur la route "/" : une requête GET est envoyé lorsqu'on valide une URL
app.get("/", (req:express.Request, res:express.Response) => {
    try {
        const histoire = req.query.histoire as unknown as string;
        const choix = req.query.choix as unknown as string;


        if(histoire) {
            if(choix) {
            Story.find({name:histoire}, (result_story:IStory) => {
                if (result_story) {
                    checkChoice(res, result_story, result_story, choix)
                }
            })
            } else {
                res.status(202).json({
                    message:"Voici l'histoire demandé",
                    histoire:histoire,
                })

            }
        } else {
            res.status(404).json({
                message:"Histoire inexistante"
            })
        }

        res.status(404).json({
            message:"pas d'histoire demandé",
            histoire:histoire,
            choix:choix
        })
    } catch (err) {
        res.status(400).json(err)
    }
})


/**
 * 
 */
app.post("/create-choice",async (req:express.Request, res:express.Response) => {
    try{
        const histoire = req.body.histoire as unknown as string;
        const choix = req.body.choix as unknown as string;
        
        const newChoice = new Choice({
            name:req.body.name,
            content:req.body.content,
            nomImg:req.body.nomImg,
            choices:[]
        })
        console.log("newchoic1",newChoice)

        if(histoire) {
            console.log("histoire exist");
            
            if(choix) {
                console.log("choix exist");
                
                const result_story = await Story.findOne({name:histoire}).populate("choices");

                if(result_story) {
                    addChoice(res, result_story, result_story, choix, newChoice)
                }
            } else {
                console.log("in other");
                
                res.status(404).json({
                    message:"Le choix ciblé n'existe pas"
                })
            }
        } else {
            res.status(404).json({
                message:"L'histoire n'existe pas"
            })
        }
    }catch (err) {
        console.log("in catch");
        
        res.status(400).json(err);
    }
})

app.post("/create-story", async (req:express.Request, res:express.Response) => {
    try{
        
    
        const story_name = req.body.name;
        const story_content = req.body.content;

        if(story_name && story_content) {

            const checkStoryExist = await Story.findOne({name:story_name});

            if(checkStoryExist !== null) {
                res.status(400).json({
                    message:"Une histoire avec ce nom existe déja"
                })
            } else {
                const newStory = new Story({
                    name:req.body.name,
                    content:req.body.content,
                    choices:[]
                })
            
                await newStory.save()
        
                res.status(201).json(newStory);
            }
            
    } else {
        res.json({
            message:"no name or content"
        })
    }

    }catch (err) {
        res.status(400).json({
            error:true,
            err:err
        });
    }
})

app.listen(3000, () => {
    console.log("Server start")
})