// create new Mongo collection to store tasks
import { Mongo } from 'meteor/mongo';

export const TasksCollection = new Mongo.Collection('tasks');