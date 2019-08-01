<template>
  <pdf-list :creatorId="creatorId" :vendorId="vendorId"></pdf-list>
</template>

<script>
import PdfList from '../../components/PdfList';
export default {
  props: ['creatorId', 'vendorId'],
  data() {
    return {
    }
  },
  components: {
    PdfList
  }
}
</script>

<style scoped lang="scss">
</style>
