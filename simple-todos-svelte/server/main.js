// imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods'; // force use of tasks methods
import '/imports/api/tasksPublications'; // force use of tasks publications

// insert tasks
const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText, // task text
    userId: user._id, // user id who made the task
    createdAt: new Date(), // current date
  });

// default user info
const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  // create new user on startup if not in database
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  // if no tasks on load, insert sample ones
  if (TasksCollection.find().count() === 0) {
    [
      'Buy groceries',
      'Walk the dog',
      'Cook dinner',
      'Finish CS279r homework',
      'Call mom',
      'Vacuum',
      'Wash the dishes'
    ].forEach(taskText => insertTask(taskText, user)); // attach user to task too
  }
});