<template>
  <section class="ocm-section-box">
    <headline :caption="caption" :tips="tips">
      <slot name="hd" v-if="$slots.hd"></slot>
    </headline>
    <div class="bd" v-if="$slots.default">
      <slot></slot>
    </div>
  </section>
</template>

<script>
import Headline from '@/components/Headline'
export default {
  name: 'SectionBox',
  props: {
    caption: {
      type: String,
      default: '标题'
    },
    tips: {
      type: String,
      default: ''
    }
  },
  components: {
    Headline
  }
}
</script>
