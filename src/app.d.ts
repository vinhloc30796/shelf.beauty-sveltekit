// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Extending Window 
	interface Window {
		// for gtag
		gtag: (command: string, eventName: string, params?: object | undefined) => void;
	}
}

export {};
