/// <reference types="svelte" />

interface Window {
    goto: (url: string) => Promise<void>;
}