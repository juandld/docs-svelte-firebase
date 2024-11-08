import type { RequestHandler } from '@sveltejs/kit';
import { AudioService } from '$lib/server/deepgram/audioService';

const audioService = new AudioService(import.meta.env.VITE_DEEPGRAM_API_KEY || 'defaultApiKey');

export const POST: RequestHandler = async ({ request }) => {
    const { action, audioData } = await request.json();

    if (action === 'toggle') {
        await audioService.toggleCall();
        return new Response(JSON.stringify({ message: audioService.isOpen ? 'Started' : 'Stopped' }));
    }

    if (action === 'sendAudio' && audioData) {
        const audioBuffer = new Uint8Array(audioData).buffer;
        await audioService.sendAudioData(audioBuffer);
        return new Response(JSON.stringify({ transcript: audioService.transcriptStore }));
    }

    return new Response('Invalid request', { status: 400 });
};
