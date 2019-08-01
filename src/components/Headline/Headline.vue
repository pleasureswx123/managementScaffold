<template>
  <header class="ocm-headline">
    <h3>{{caption}}</h3>
    <div class="slot-box" v-if="$slots.default">
      <slot></slot>
    </div>
    <small v-if="tips">{{tips}}</small>
  </header>
</template>

<script>
export default {
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
  name: 'Headline'
}
</script>
