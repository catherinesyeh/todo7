<script>
  // imports
  import Task from "./Task.svelte";
  import TaskForm from "./TaskForm.svelte";
  import LoginForm from "./LoginForm.svelte";
  import { TasksCollection } from "../db/TasksCollection";

  // allow user to hide tasks that are completed depending on whether button is pressed
  let hideCompleted = false;
  const setHideCompleted = (value) => {
    hideCompleted = value;
  };

  // declare some vars
  const hideCompletedFilter = { isChecked: { $ne: true } };
  let incompleteCount;
  let pendingTasksTitle = "";
  let tasks = [];
  let user = null;

  let isLoading = true;
  const handler = Meteor.subscribe("tasks"); // subscribe to tasks in database

  // hide completed tasks on render (i.e., only show not completed ones)
  // sort by newest first
  // (reactive statement from svelte)
  $m: {
    // get authenticated user or null
    user = Meteor.user();

    if (user) {
      isLoading = !handler.ready(); // load app when handler is ready

      // filters to view tasks by user or completion status
      const userFilter = user ? { userId: user._id } : {};
      const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

      // render tasks, making sure to filter by user / completing status if selected
      tasks = user
        ? TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
            sort: { createdAt: -1 },
          }).fetch()
        : [];

      // show number of pending tasks on load too
      incompleteCount = user
        ? TasksCollection.find(pendingOnlyFilter).count()
        : 0;

      pendingTasksTitle = `${incompleteCount ? ` (${incompleteCount})` : ""}`;
    }
  }

  const logout = () => Meteor.logout(); // logout function
</script>

<!-- start app -->
<div class="app">
  <header>
    <div class="app-bar">
      <div class="app-header">
        <!-- heading -->
        <h1>📝️ Todo List {pendingTasksTitle}</h1>
      </div>
    </div>
  </header>

  <div class="main">
    <!-- load app if logged user -->
    {#if user}
      <!-- display username and let user log out on click-->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div title="click to log out" class="user" on:click={logout}>
        {user.username} 🚪
      </div>

      <!-- display form to add new task -->
      <TaskForm />

      <!-- button to show all task/hide completed ones -->
      <div class="filter">
        <button
          title="toggle task view"
          on:click={() => setHideCompleted(!hideCompleted)}
        >
          {hideCompleted ? "Show All" : "Hide Completed"}
        </button>
      </div>

      <!-- show loading message if subscription data isn't ready yet -->
      {#if isLoading}
        <div class="loading">loading...</div>
      {/if}

      <ul class="tasks">
        <!-- display task list -->
        {#each tasks as task (task._id)}
          <Task {task} />
        {/each}
      </ul>
    {:else}
      <!-- otherwise, if new user, render login form -->
      <LoginForm />
    {/if}
  </div>
</div>
