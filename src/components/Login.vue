<template>
<b-container class="globalpadding">
    <b-card header="Login" border-variant="primary" header-bg-variant="primary" header-text-variant="white">
        <b-form @submit="onSubmit">
        <b-form-group id="Username"
                      label="Username"
                      label-for="username">
          <b-form-input id="username"
                        type="text"
                        v-model="form.username"
                        required
                        placeholder="Enter the Username">
          </b-form-input>
        </b-form-group>
        <b-form-group id="Password"
                      label="Password"
                      label-for="password">
          <b-form-input id="password"
                        type="password"
                        v-model="form.password"
                        required
                        placeholder="Enter the passwordt">
          </b-form-input>
          </b-form-group>
        <b-button type="submit" variant="primary">Log In</b-button>
        </b-form>
    </b-card>
</b-container>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
        form: {
            username: '',
            password: ''
        }
    }

    },
    methods: {
        onSubmit: function(evt) {
            evt.preventDefault();
        }
    }
}
</script>

<style>
.globalpadding {
    padding-bottom: 2vh;
}
</style>