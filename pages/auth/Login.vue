<template lang="pug">
    div
      v-form(v-model="valid" ref="form" lazy-validation)
        h1 Login!
        v-text-field(v-model="username" label="Username" required
                     v-bind:error-messages="errorMessage" :rules="[rules.username]")
        v-text-field(v-model="password" label="Password" type="password" required
                     v-bind:error-messages="errorMessage" :rules="[rules.password]")
        v-btn(@click="login" :disabled="!valid") Login
        br 
        router-link(to="/auth/register" color="grey") Register a new account
</template>

<script>
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      username: "",
      password: "",
      valid: false,
      error: false,
      errorMessage: [],
      rules: {
        username: value => {
          if (value.length < 3) return "3 characters minimum"
          return true
        },
        password: value => {
          if (value.length < 6) return "6 characters minimum"
          return true
        }
      }
    }
  },
  computed: mapGetters(["loginState"]),
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        // Reset any error messages
        this.$data.errorMessage = []

        this.$store
          .dispatch("login", {
            username: this.$data.username,
            password: this.$data.password
          })
          .then(result => {
            if (result.error) {
              this.$data.errorMessage = ["Bad credentials"]
            } else {
              this.$data.errorMessage = []
            }
          })
      }
    }
  }
}
</script>

<style>

</style>
