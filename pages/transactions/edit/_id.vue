<template lang="pug">
  div
    v-layout(column justify-center align-center)
      v-flex(xs12 sm8 md6)
        h1 Coming Soon™ :-)
        div {{transaction}}
        v-btn(@click="submit") SUBMIT  
</template> 


<script>
import gql from "graphql-tag"
import { mapGetters, mapActions } from "vuex"

export default {
  data() {
    return {
      transaction: null
    }
  },
  methods: {
    submit() {
      const { id } = this.$router.history.current.params

      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: EditTransactionMutationInput!) {
              editTransaction(input: $input) {
                transaction {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            input: {
              transactionId: id
            }
          }
        })
        .then(data => {
          this.$router.push("/transactions")
        })
        .catch(error => {
          console.log(error)
        })
    },
    ...mapActions([])
  },
  apollo: {
    transaction: {
      query: gql`
        query TransactionQuery($transaction_id: Int!) {
          getTransaction(id: $transaction_id) {
            id
            date
            spentCurrency
            spentAmount
            acquiredCurrency
            acquiredAmount
            feeCurrency
            feeAmount
            bookPriceEur
            bookPriceBtc
            bookPriceFeeEur
            bookPriceFeeBtc
            sourcePeer {
              id
              name
              classType
            }
            targetPeer {
              id
              name
              classType
            }
            tags
          }
        }
      `,
      variables() {
        const { id } = this.$router.history.current.params

        return {
          transaction_id: id
        }
      },
      update: data => data.getTransaction
    }
  },
  computed: mapGetters([]),
  watch: {}
}
</script>
