 <template lang="pug">
    div
      v-layout(column justify-center align-center)
        v-flex(xs12 sm8 md6) 
          v-text-field(v-model="name" label="Name", hint="e.g. My Binance account")
          v-text-field(v-model="api_key" label="API Key")
          v-text-field(v-model="api_secret" label="API secret")
          v-btn(@click="submit") SUBMIT  
</template> 


<script>
import gql from "graphql-tag"
import { mapGetters, mapActions } from "vuex"

export default {
  data() {
    return {
      name: "",
      api_key: "",
      api_secret: ""
    }
  },
  methods: {
    submit() {
      const { id } = this.$router.history.current.params

      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: EditAccountMutationInput!) {
              editAccount(input: $input) {
                account {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            input: {
              accountId: id,
              name: this.name,
              apiKey: this.api_key,
              apiSecret: this.api_secret
            }
          }
        })
        .then(data => {
          this.$router.push("/accounts")
        })
        .catch(error => {
          console.log(error)
        })
    },
    ...mapActions([])
  },
  apollo: {
    name: {
      query: gql`
        query AccountQuery($account_id: Int!) {
          getAccount(id: $account_id) {
            name
          }
        }
      `,
      variables() {
        const { id } = this.$router.history.current.params

        return {
          account_id: id
        }
      },
      update: data => data.getAccount.name
    }
  },
  computed: mapGetters([]),
  watch: {}
}
</script>
