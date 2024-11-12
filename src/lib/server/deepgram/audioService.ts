import { createClient, type LiveTranscriptionEvent, LiveTranscriptionEvents } from "@deepgram/sdk";

export class AudioService {
    private apiKey: string;
    private client: any;
    private connection: any;
    public isOpen = false;
    public transcriptStore: string = '';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        
        // Check for placeholder API key
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
            });

            this.connection.on(LiveTranscriptionEvents.Transcript, (transcript: LiveTranscriptionEvent) => {
                const words = transcript.channel?.alternatives[0]?.transcript || '';
                if (transcript.is_final) {
                    this.transcriptStore += words + ' ';
                }
            });

            this.connection.on(LiveTranscriptionEvents.Error, (error: any) => {
                console.error('Transcription error:', error);
            });

            this.connection.on(LiveTranscriptionEvents.Close, () => {
                console.log('Connection closed');
                this.isOpen = false;
            });
        } catch (error) {
            console.error('Failed to start transcription:', error);
            throw error;
        }
    }

    private async stopTranscription() {
        if (this.connection) {
            await this.connection.finish();
            this.connection = null;
            this.isOpen = false;
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
        this.transcriptStore = '';
    }
}
