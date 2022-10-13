<!-- task form component -->
<script>
  let newTask = "";
  const handleSubmit = () => {
    // insert a task into the collection on submit
    if (!newTask) return;

    Meteor.call("tasks.insert", newTask);

    // clear form
    newTask = "";
  };
</script>

<!-- form to add new todo -->
<!-- run custom function on submit that takes binded input value -->
<form class="task-form" on:submit|preventDefault={handleSubmit}>
  <input
    type="text"
    name="text"
    placeholder="Type to add new tasks"
    title="type task"
    bind:value={newTask}
  />
  <button type="submit" title="add task">Add Task</button>
</form>
