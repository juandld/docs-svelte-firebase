<script lang="ts">
    import  {AudioService}  from '$lib/util/audio/audioService.svelte';
    import { onMount, onDestroy } from 'svelte';
    
    let audioService: AudioService;
    
    onMount(() => {
        audioService = new AudioService(import.meta.env.VITE_DEEPGRAM_API_KEY);
    });
    
    onDestroy(() => {
        if (audioService) {
            audioService.stopCall();
        }
    });
</script>

<button on:click={() => audioService.toggleCall()}>
    {audioService?.isOpen ? 'Stop Call' : 'Start Call'}
</button>