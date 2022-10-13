import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

// publish all tasks from authenticated user
Meteor.publish('tasks', function publishTasks() {
    return TasksCollection.find({ userId: this.userId });
});