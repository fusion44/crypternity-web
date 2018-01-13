<template lang="pug">
    div
      div(v-if="getUserLoginState === 'valid'") Hello {{getUserName}}
        v-menu(offset-y)
          v-btn(icon flat slot="activator") 
            v-icon(dark) account_circle
          v-list
            v-list-tile(v-for="item in loggedInMenuItems" :key="item.title" @click="item.click")
              v-list-tile-title {{ item.title }} 
      div(v-else="!loggedIn")
        v-btn(router to="/auth/login"    color="primary") Login
        v-btn(router to="/auth/register" color="primary") Register
</template> 


<script>
import * as consts from "../../constants"
import { mapGetters, mapActions } from "vuex"

export default {
  data() {
    return {
      loggedIn: false,
      loggedInMenuItems: [
        { title: "Settings", click: this.onSettingsClick },
        { title: "Logout", click: this.onLogoutClick }
      ]
    }
  },
  methods: {
    onSettingsClick() {
      console.log("settings")
    },
    onLogoutClick() {
      this.logout()
        .then(res => this.$router.push("/auth/login"))
        .catch(error => console.log(error))
    },
    ...mapActions(["logout"])
  },
  computed: mapGetters(["getUserLoginState", "getUserName"]),
  watch: {
    getUserLoginState(val) {
      return val === consts.JWT_TOKEN_VALID ? this.$router.push("/") : undefined
    }
  }
}
</script>

<style>

</style>
