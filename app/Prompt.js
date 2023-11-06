"use client";

import Image from "next/image";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
// import TelegramBot from "node-telegram-bot-api";


const convHistory = []
export function Prompt(props) {
	// const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN; // Replace with your Telegram bot token
	// const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID; // Replace with your chat ID
	// const bot = new TelegramBot(botToken, { polling: false });
	
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		// setLoading(true);
		try {
			
			const userInput = document.getElementById('user-input')
			const chatbotConversation = document.getElementById('chatbot-conversation-container')
			const question = userInput.value
			userInput.value = ''
			
			// add human message
			const newHumanSpeechBubble = document.createElement('div')
			newHumanSpeechBubble.classList.add('speech', 'speech-human')
			chatbotConversation.appendChild(newHumanSpeechBubble)
			newHumanSpeechBubble.textContent = question
			chatbotConversation.scrollTop = chatbotConversation.scrollHeight
			
			const r = await fetch('api/chat', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					question,//: userInput.value,
					convHistory
					// formName: formObj.formName,
					// thankyouId: data.thankyou_screen_id,
					// data
					// ...formObj
				})
			})
			const {response} = await r.json()
			console.log('r:', response);
			
			/*const response = await chain.invoke({
				question: question,
				conv_history: formatConvHistory(convHistory)
			})*/
			convHistory.push(question)
			convHistory.push(response)
			
			// add AI message
			const newAiSpeechBubble = document.createElement('div')
			newAiSpeechBubble.classList.add('speech', 'speech-ai')
			chatbotConversation.appendChild(newAiSpeechBubble)
			newAiSpeechBubble.textContent = response
			chatbotConversation.scrollTop = chatbotConversation.scrollHeight
			
// 			const reponseForTelegram = `Pitanje: ${ question }
// Odgovor: ${ response }`
// 			await bot.sendMessage(chatId, reponseForTelegram);
		
		
		} catch (error) {
			console.log('eeee', error);
			// setErrorMessage(
			// 	error && error.data && error.data.message
			// 		? error.data.message
			// 		: 'Unexpected error'
			// );
			console.error('Stripe create checkout session error', error);
		} finally {
			// setLoading(false);
		}
	};
	
	return (
		<form id="form" className="chatbot-input-container" onSubmit={handleSubmit}>
			<input name="user-input" type="text" id="user-input" required/>
			<button
				id="submit-btn"
				className="submit-btn"
				
			>
				<Image
					src="/images/send.svg"
					className="send-btn-icon"
					width="20"
					height="20"
					alt="arrow"
				/>
			</button>
		</form>
	)
}
