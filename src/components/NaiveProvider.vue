<script lang="ts" setup>
import {useMessage} from 'naive-ui'

const NaiveProviderContent = defineComponent({
  name:'NaiveProviderContent',

  setup(){
    window.$message = useMessage()
  },

  render(){
    return h('div')
  }
})
</script>

<template>
  <NMessageProvider>
    <NDialogProvider>
      <slot></slot>
      <NaiveProviderContent></NaiveProviderContent>
    </NDialogProvider>
  </NMessageProvider>
</template>
