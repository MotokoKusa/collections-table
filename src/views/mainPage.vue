<template>
  <div class="container">
    <base-table />
  </div>
</template>

<script>
import BaseTable from "@/components/BaseTable";
export default {
  components: {
    BaseTable,
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>
