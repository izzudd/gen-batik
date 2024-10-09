<script lang="ts" setup>
const { image } = useRoute().query
onMounted(() => {
  if (image) document.documentElement.style.backgroundImage = `url(${image})`;
  document.documentElement.style.backgroundRepeat = 'repeat';
})
onUnmounted(() => {
  document.documentElement.style.backgroundImage = '';
})
</script>