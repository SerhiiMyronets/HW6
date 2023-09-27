import mongoose from "mongoose";
import {BlogMongoDBModel} from "./db-models";

export const BlogSchema = new mongoose.Schema<BlogMongoDBModel>({
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    createdAt: {type: Date},
    isMembership: {type: Boolean}
})