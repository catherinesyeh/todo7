import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';

// add methods to perform operations, instead of calling them directly from client
// this helps make changes in the server more safely
Meteor.methods({
    // insert a new task
    'tasks.insert'(text) {
        check(text, String); // make sure text is string

        if (!this.userId) { // only let authorized users insert tasks
            throw new Meteor.Error('Not authorized.');
        }

        TasksCollection.insert({
            text, // task text
            createdAt: new Date(), // current date
            userId: this.userId, // user id
        })
    },

    // remove a task
    'tasks.remove'(taskId) {
        check(taskId, String); // make sure task id is string

        if (!this.userId) { // only let authorized users delete tasks
            throw new Meteor.Error('Not authorized.');
        }

        // make sure task was created by same user
        const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }

        TasksCollection.remove(taskId);
    },

    // change completion status of task
    'tasks.setIsChecked'(taskId, isChecked) {
        check(taskId, String); // make sure task id is string and isChecked is boolean
        check(isChecked, Boolean);

        if (!this.userId) { // only let authorized users set completion status of tasks
            throw new Meteor.Error('Not authorized.');
        }

        // make sure task was created by same user
        const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }


        TasksCollection.update(taskId, {
            $set: {
                isChecked
            }
        });
    }
});