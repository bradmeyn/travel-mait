import { setContext, getContext } from 'svelte';

export type Message = {
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp?: Date;
};

class Chat {
	messages = $state<Message[]>([]);
	isSubmitting = $state(false);

	addMessage(message: Message) {
		this.messages = [...this.messages, { ...message, timestamp: new Date() }];
	}

	setSubmitting(submitting: boolean) {
		this.isSubmitting = submitting;
	}

	clearMessages() {
		this.messages = [];
	}
}

const CHAT_KEY = Symbol('chat');

export function setChatState() {
	return setContext(CHAT_KEY, new Chat());
}

export function getChatState(): Chat {
	const chatState = getContext<Chat>(CHAT_KEY);
	if (!chatState) {
		throw new Error(
			'Chat state not found. Make sure to call setChatState() in a parent component.'
		);
	}
	return chatState;
}
