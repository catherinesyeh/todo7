<!-- task component -->
<script>
  export let task;

  // set the isChecked property to the opposite of its current value
  // (i.e., not done --> done and vice versa)
  const toggleChecked = () =>
    Meteor.call("tasks.setIsChecked", task._id, !task.isChecked);

  // delete todo item by id
  const deleteThisTask = () => Meteor.call("tasks.remove", task._id);
</script>

<li>
  <!-- add checkbox to toggle status of each todo -->
  <input
    type="checkbox"
    readonly
    checked={!!task.isChecked}
    on:click={toggleChecked}
  />
  <!-- display todo text -->
  <span>{task.text}</span>
  <!-- delete button -->
  <button class="delete" on:click={deleteThisTask}>&times;</button>
</li>
