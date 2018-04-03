<template lang="pug">
  td
    div(class="td-amount-container") 
      span(class="td-symbol") {{ this.symbol }}
      span {{ this.amount }} 
</template>

<script>
export default {
  props: {
    amount: { type: Number, required: true },
    symbol: { type: String, required: true }
  }
}
</script>

<style scoped>
.td-amount-container {
  width: auto;
  display: inline-block;
  white-space: nowrap;
}

.td-symbol {
  width: 35px;
  display: inline-block;
  white-space: nowrap;
  font-weight: bold;
}
</style>
