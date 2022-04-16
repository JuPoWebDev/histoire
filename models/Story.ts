import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import {Choice, IChoice} from "./Choice";

export interface IStory extends mongoose.Document {
    name: string,
    content:string,
    choices?:  IChoice[];
  }

const storySchema = new Schema<IStory>({
    name:{
        type : String,
        required : [true, "Toute histoire mérite un nom"],
    },
    content:{
        type : String,
        required : [true, "Toute histoire mérite un contenu"],
    },
    choices:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Choice"
    }
})

export const Story = model<IStory>("Story", storySchema)