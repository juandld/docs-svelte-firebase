import type { RequestHandler } from '@sveltejs/kit';
import { AudioService } from '$lib/server/deepgram/audioService';

const audioService = new AudioService(import.meta.env.VITE_DEEPGRAM_API_KEY || 'defaultApiKey');

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { action, audioData } = await request.json();
        
        if (action === 'toggle') {
            await audioService.toggleCall();
            return new Response(JSON.stringify({ message: audioService.isOpen ? 'Started' : 'Stopped' }));
        }
        
        if (action === 'sendAudio' && audioData) {
            const audioBuffer = new Uint8Array(audioData).buffer;
            await audioService.sendAudioData(audioBuffer);
            
            try {
                const response = await fetch('http://localhost:5000/chunking');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return new Response(JSON.stringify({ transcript: data.transcript }));
            } catch (error) {
                console.error('Error fetching transcript from microservice:', error);
                return new Response(JSON.stringify({ transcript: 'Error fetching transcript' }));
            }
        }
        
        return new Response('Invalid request', { status: 400 });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
};