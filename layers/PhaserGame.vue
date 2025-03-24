<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Scene } from 'phaser'
import { EventBus } from '~/utils/game/EventBus'
import StartGame from '~/utils/game/main'

// Save the current scene instance
const scene = ref()
const game = ref()

const emit = defineEmits(['current-active-scene'])

onMounted(() => {
  game.value = StartGame('game-container')

  EventBus.on('current-scene-ready', (scene_instance: Scene) => {
    emit('current-active-scene', scene_instance)

    scene.value = scene_instance
  })

  // window.addEventListener('resize', () => {
  //   onChangeScreen()
  // })

  // const _orientation = screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation
  // _orientation.addEventListener('change', () => {
  //   onChangeScreen()
  // })

  // console.log(window)
})

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true)
    game.value = null
  }

  // window.removeEventListener('resize', () => {})
})

// const onChangeScreen = () => {
//   game.value.scale.resize(window.innerWidth, window.innerHeight)
//   if (game.value.scene.scenes.length > 0) {
//     const currentScene = game.value.scene.scenes[0]
//     if (currentScene) {
//       currentScene.resize()
//     }
//   }
// }

defineExpose({ scene, game })
</script>

<template>
  <div id="game-container" />
</template>
