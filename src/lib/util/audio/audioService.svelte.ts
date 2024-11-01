import { createClient, type LiveTranscription, LiveTranscriptionEvents } from '@deepgram/sdk';

// Type definitions
interface TranscriptStore {
    input?: string;
}

interface AudioServiceState {
    isOpen: boolean;
    transcriptStore: TranscriptStore;
    convoStore: any[];
}

export class AudioService {
    private deepgram;
    private connection: LiveTranscription | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private stream: MediaStream | null = null;
    private intermediateResults: string[] = [];

    // Signals for state management
    private state = $state({
        isOpen: false,
        transcriptStore: {},
        convoStore: []
    });

    constructor(apiKey: string) {
        this.deepgram = createClient(apiKey);
        
        // Set up effect to handle state changes
        $effect(() => {
            if (this.state.isOpen) {
                this.startCall();
            } else {
                this.stopCall();
            }
        });
    }

    private async setupMediaRecorder() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                if (this.state.isOpen && this.connection) {
                    this.connection.send(event.data);
                }
            });

            this.mediaRecorder.start(1500);
        } catch (error) {
            console.error('Error setting up media recorder:', error);
            throw error;
        }
    }

    private setupDeepgramConnection() {
        this.connection = this.deepgram.listen.live({
            model: 'nova-2',
            language: 'en-US',
            smart_format: true,
            utterance_end_ms: 1000,
            interim_results: true
        });

        this.connection.on(LiveTranscriptionEvents.Open, () => {
            this.state.isOpen = true;
        });

        this.connection.on(LiveTranscriptionEvents.Close, () => {
            this.state.isOpen = false;
            this.state.convoStore = [];
        });

        this.connection.on(LiveTranscriptionEvents.Error, (err) => {
            console.error('Deepgram connection error:', err);
        });

        this.connection.on(LiveTranscriptionEvents.Transcript, (data) => {
            if (data.is_final && data.channel.alternatives[0].transcript !== '') {
                const concatenatedTranscript = data.channel.alternatives
                    .map((alt) => alt.transcript)
                    .join(' ');
                this.intermediateResults.push(concatenatedTranscript);
            }
        });

        this.connection.on(LiveTranscriptionEvents.UtteranceEnd, () => {
            this.handleUtteranceEnd();
        });
    }

    private handleUtteranceEnd() {
        const wholeString = this.intermediateResults.join('. ');
        
        this.state.transcriptStore = { input: wholeString };
        
        this.intermediateResults = [];
        
        this.playNotificationSound();
        
        // Reset transcript store
        this.state.transcriptStore = {};
    }

    private playNotificationSound() {
        const audioElement = document.createElement('audio');
        audioElement.src = "./ding.mp3";
        document.body.appendChild(audioElement);
        audioElement.play().finally(() => {
            document.body.removeChild(audioElement);
        });
    }

    public async startCall() {
        try {
            await this.setupMediaRecorder();
            this.setupDeepgramConnection();
        } catch (error) {
            console.error('Failed to start call:', error);
            this.state.isOpen = false;
        }
    }

    public async stopCall() {
        this.connection?.finish();
        this.mediaRecorder?.stop();
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
        }

        this.connection = null;
        this.mediaRecorder = null;
        this.stream = null;
    }

    public toggleCall() {
        if (this.state.isOpen) {
            this.stopCall();
        } else {
            this.startCall();
        }
    }

    // Getters for accessing state
    public get isOpen() {
        return this.state.isOpen;
    }

    public get transcriptStore() {
        return this.state.transcriptStore;
    }

    public get convoStore() {
        return this.state.convoStore;
    }
}