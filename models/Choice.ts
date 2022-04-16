import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';


export interface IChoice extends mongoose.Document{
    name: string,
    content:string,
    nomImg:string,
    choices?:  IChoice[];
  }

const choiceSchema = new Schema<IChoice>({
    name:{
        type:String,
        required:[true, "Ce choix mérite un nom"]
    },
    content:{
        type:String,
        required:[true, "Ce choix mérite un contenu"]
    },
    nomImg:{
        type:String,
    },
    choices:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Choice"    
    }
})

export var Choice = model<IChoice>("Choice", choiceSchema)
