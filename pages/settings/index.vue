<template lang="pug">
  div  
    v-tabs(dark v-model="active")
      v-tab(:key=1) User Data
      v-tab-item(:key=1)
        v-card(flat)
          h1 Update My Account Settings
      v-tab(:key=2) System Admin
      v-tab-item(:key=2)
        v-card(flat)
          h3 Update Supported Coins 
          v-btn(@click="updateSupportedCoins" :disabled="!isAdmin") Update
</template>

<script>
import gql from "graphql-tag"

export default {
  data() {
    return {
      active: null,
      isAdmin: false
    }
  },
  methods: {
    updateSupportedCoins() {
      this.$apollo.mutate({
        mutation: gql`
          mutation RefreshSupportedCoins(
            $input: CoinRefreshTransactionsMutationInput!
          ) {
            coinsRefreshMutation(input: $input) {
              msg
              formErrors
              status
            }
          }
        `,
        variables: {
          input: {
            clientMutationId: "abcde"
          }
        }
      })
    }
  },
  apollo: {
    isAdmin: {
      query: gql`
        {
          getCurrentUser {
            isSuperuser
          }
        }
      `,
      update: data => data.getCurrentUser.isSuperuser
    }
  }
}
</script>

<style>

</style>
