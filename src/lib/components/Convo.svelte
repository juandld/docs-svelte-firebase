<script lang="ts">
    import { onDestroy } from 'svelte';
    
    let isRecording = false;
    let transcript = '';
    let chunkResponse = '';
    let mediaStream: MediaStream | null = null;
    let mediaRecorder: MediaRecorder | null = null;
  
    async function toggleRecording() {
        try {
            if (!isRecording) {
                mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(mediaStream);
                mediaRecorder.ondataavailable = async (event) => {
                    if (event.data.size > 0) {
                        const arrayBuffer = await event.data.arrayBuffer();
                        await fetch('/api/transcribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'sendAudio', audioData: Array.from(new Uint8Array(arrayBuffer)) })
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            transcript = data.transcript || '';
                        });
  
                        // Fetch the chunked response
                        try {
                            const chunkResp = await fetch('http://localhost:5000/chunking');
                            const chunkData = await chunkResp.json();
                            chunkResponse = chunkData.transcript || '';
                        } catch (error) {
                            console.error('Error fetching chunk response:', error);
                        }
                    }
                };
  
                await fetch('/api/transcribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'toggle' })
                });
                
                mediaRecorder.start(1000);
                isRecording = true;
            } else {
                mediaRecorder?.stop();
                mediaStream?.getTracks().forEach((track) => track.stop());
               
                await fetch('/api/transcribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'toggle' })
                });
                isRecording = false;
            }
        } catch (error) {
            console.error('Error toggling recording:', error);
            isRecording = false;
        }
    }
  
    onDestroy(() => {
        mediaRecorder?.stop();
        mediaStream?.getTracks().forEach((track) => track.stop());
    });
  </script>
  
  <div class="flex flex-col items-center gap-4 p-4">
    <button
        on:click={toggleRecording}
        class="px-4 py-2 rounded-lg {isRecording
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-500 hover:bg-blue-600'}
          text-white transition-colors"
    >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  
    <div class="w-full max-w-2xl">
      <h3 class="text-lg font-semibold mb-2">Original Transcript:</h3>
      <div class="min-h-[100px] p-4 bg-gray-100 rounded-lg mb-4">
        <p class="whitespace-pre-wrap">
            {transcript || 'Transcript will appear here...'}
        </p>
      </div>
  
      <h3 class="text-lg font-semibold mb-2">Flask Service Response:</h3>
      <div class="min-h-[100px] p-4 bg-blue-50 rounded-lg">
        <p class="whitespace-pre-wrap">
            {chunkResponse || 'Waiting for Flask service response...'}
        </p>
      </div>
    </div>
  </div>