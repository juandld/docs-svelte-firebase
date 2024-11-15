import { createClient, type LiveTranscriptionEvent, LiveTranscriptionEvents } from "@deepgram/sdk";

export class AudioService {
    private apiKey: string;
    private client: any;
    private connection: any;
    public isOpen = false;
    private transcriptBuffer: string = '';
    private processingInterval: NodeJS.Timeout | null = null;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        
        if (this.apiKey === 'defaultApiKey') {
            console.error("Warning: Using default API key. Please set the DEEPGRAM_API_KEY environment variable.");
        }
        this.client = createClient(this.apiKey);
    }

    async toggleCall() {
        if (this.isOpen) {
            await this.stopTranscription();
        } else {
            await this.startTranscription();
        }
    }

    private async startTranscription() {
        try {
            this.connection = await this.client.listen.live({
                model: "nova-2",
                language: "en",
                smart_format: true,
                interim_results: true,
                punctuate: true,
            });

            this.connection.on(LiveTranscriptionEvents.Open, () => {
                console.log('Connection opened');
                this.isOpen = true;
                
                // Start periodic sending of transcripts
                this.processingInterval = setInterval(async () => {
                    if (this.transcriptBuffer.trim()) {
                        await this.sendTranscriptToMicroservice(this.transcriptBuffer);
                        this.transcriptBuffer = '';
                    }
                }, 2000); // Send every 2 seconds if there's content
            });

            this.connection.on(LiveTranscriptionEvents.Transcript, (transcript: LiveTranscriptionEvent) => {
                const words = transcript.channel?.alternatives[0]?.transcript || '';
                if (transcript.is_final) {
                    this.transcriptBuffer += words + ' ';
                }
            });

            this.connection.on(LiveTranscriptionEvents.Error, (error: any) => {
                console.error('Transcription error:', error);
            });

            this.connection.on(LiveTranscriptionEvents.Close, () => {
                console.log('Connection closed');
                this.isOpen = false;
                if (this.processingInterval) {
                    clearInterval(this.processingInterval);
                    this.processingInterval = null;
                }
            });
        } catch (error) {
            console.error('Failed to start transcription:', error);
            throw error;
        }
    }

    private async stopTranscription() {
        if (this.connection) {
            // Send any remaining transcript before closing
            if (this.transcriptBuffer.trim()) {
                await this.sendTranscriptToMicroservice(this.transcriptBuffer);
                this.transcriptBuffer = '';
            }
            
            await this.connection.finish();
            this.connection = null;
            this.isOpen = false;
            
            if (this.processingInterval) {
                clearInterval(this.processingInterval);
                this.processingInterval = null;
            }
        }
    }

    private async sendTranscriptToMicroservice(transcript: string) {
        try {
            const response = await fetch('http://localhost:5000/chunking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcript }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error sending transcript to microservice:', error);
            throw error;
        }
    }

    async sendAudioData(audioChunk: ArrayBuffer) {
        if (this.connection && this.isOpen) {
            try {
                await this.connection.send(audioChunk);
            } catch (error) {
                console.error('Error sending audio data:', error);
            }
        }
    }

    clearTranscript() {
        this.transcriptBuffer = '';
    }
}