// imports
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';

if (Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
            // create single task with different random userID for each test run
            const userId = Random.id();
            let taskId;

            beforeEach(() => { // before each ensures the database is in the state we expect befor beginning tests
                TasksCollection.remove({});
                taskId = TasksCollection.insert({
                    text: 'Test Task',
                    createdAt: new Date(),
                    userId,
                });
            });

            // test if user can delete task they own
            it('can delete owned task', () => {
                mockMethodCall('tasks.remove', taskId, { context: { userId } });

                assert.equal(TasksCollection.find().count(), 0);
            });

            // test if deletion is blocked for non authenticated user
            it(`can't delete task without an user authenticated`, () => {
                const fn = () => mockMethodCall('tasks.remove', taskId);
                assert.throw(fn, /Not authorized/);
                assert.equal(TasksCollection.find().count(), 1);
            });

            // test if deletion is blocked if user doesn't own task
            it(`can't delete task from another owner`, () => {
                const fn = () =>
                    mockMethodCall('tasks.remove', taskId, {
                        context: { userId: 'somebody-else-id' },
                    });
                assert.throw(fn, /Access denied/);
                assert.equal(TasksCollection.find().count(), 1);
            });

            // test if user can change task status
            it('can change the status of a task', () => {
                const originalTask = TasksCollection.findOne(taskId);
                mockMethodCall('tasks.setIsChecked', taskId, !originalTask.isChecked, {
                    context: { userId },
                });

                const updatedTask = TasksCollection.findOne(taskId);
                assert.notEqual(updatedTask.isChecked, originalTask.isChecked);
            });

            // test if user can insert new tasks
            it('can insert new tasks', () => {
                const text = 'New Task';
                mockMethodCall('tasks.insert', text, {
                    context: { userId },
                });

                const tasks = TasksCollection.find({}).fetch();
                assert.equal(tasks.length, 2);
                assert.isTrue(tasks.some(task => task.text === text));
            });
        });
    });
}