<template>
  <v-app dark>
    <v-navigation-drawer :mini-variant="miniVariant" v-model="drawer" fixed app>
      <v-list>
        <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <ToolbarUserMenu />
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ToolbarUserMenu from "../components/auth/ToolbarUserMenu.vue"

export default {
  components: { ToolbarUserMenu },
  data() {
    return {
      drawer: true,
      fixed: true,
      items: [
        { icon: "home", title: "Welcome", to: "/" },
        { icon: "widgets", title: "Accounts", to: "/accounts" },
        { icon: "list", title: "Transactions", to: "/transactions" }
      ],
      miniVariant: true,
      title: "Crypternity"
    }
  },
  beforeMount() {
    this.$store.dispatch("checkToken")
  }
}
</script>
