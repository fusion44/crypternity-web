 <template lang="pug">
    div
      v-layout(column justify-center align-center)
        v-flex(sm8 md6) 
          v-data-table(v-bind:headers="headers" :items="items" class="elevation-1")
              template(slot="items" slot-scope="props")
                tr(@click="props.expanded = !props.expanded")
                  td {{ props.item.id }}
                  td {{ props.item.creationDate | moment("YYYY-MM-DD")}}
                  td {{ props.item.name }}
                  td {{ props.item.serviceType }}
              template(slot="expand", slot-scope="props")
                v-card(flat)
                  v-btn(@click="onActionClick('stats', props.item.id)" flat) stats 
                  v-btn(@click="onActionClick('edit', props.item.id)" flat) edit
                  v-btn(@click="onActionClick('delete', props.item.id)" flat) delete
                  v-btn(@click="onActionClick('full_update', props.item.id)" flat) full update
          v-btn(router="router" to="/accounts/add" color="primary") ADD
</template>

<script>
import gql from "graphql-tag"

export default {
  data() {
    return {
      headers: [
        {
          text: "id",
          align: "left",
          value: "id"
        },
        { text: "created", value: "creationDate" },
        { text: "name", value: "name" },
        { text: "service", value: "serviceType" }
      ],
      items: []
    }
  },
  methods: {
    onActionClick(type, id) {
      switch (type) {
        case "stats":
          console.log("click ", type, id)
          break
        case "edit":
          this.$router.push(`/accounts/edit/${id}`)
          break
        case "delete":
          console.log("click ", type, id)
          break
        case "full_update":
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($input: AccountRefreshTransactionsMutationInput!) {
                  accountRefreshTransactions(input: $input) {
                    status
                    msg
                  }
                }
              `,
              variables: {
                input: {
                  accountId: id
                }
              }
            })
            .then(({ data }) => {
              console.log(data.accountRefreshTransactions.msg)
            })
            .catch(error => {
              console.log(error)
            })
          break
        default:
      }
    }
  },
  apollo: {
    items: {
      query: gql`
        {
          allAccounts {
            id
            creationDate
            name
            serviceType
          }
        }
      `,
      update: data => data.allAccounts
    }
  },
  watch: {}
}
</script>

<style>

</style>
