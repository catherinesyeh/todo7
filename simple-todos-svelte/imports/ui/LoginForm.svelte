<!-- login form component -->
<script>
  import { Meteor } from "meteor/meteor";

  let username = "";
  let password = "";

  const handleSubmit = () => {
    // authenticate user info
    Meteor.loginWithPassword(username, password);
  };
</script>

<!-- form for users to login -->
<form class="login-form" on:submit|preventDefault={handleSubmit}>
  <div>
    <label for="username">Username</label>
    <!-- input field for username -->
    <input
      type="text"
      placeholder="Username"
      name="username"
      required
      bind:value={username}
    />
  </div>

  <div>
    <label for="password">Password</label>
    <!-- input field for password -->
    <input
      type="password"
      placeholder="Password"
      name="password"
      required
      bind:value={password}
    />
  </div>
  <div>
    <!-- submit button to login -->
    <button type="submit">Log In</button>
  </div>
</form>
