<template>
  <section class="ocm-section-line">
    <h3 :style="{width: `${labelWidth}px`}">{{caption}}</h3>
    <div class="right-side" v-if="$slots.default">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SectionLine',
  props: {
    caption: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: Number,
      default: 150
    }
  }
}
</script>
