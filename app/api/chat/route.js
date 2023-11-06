import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { combineDocuments } from "@/utils/combineDocuments";
import { formatConvHistory } from "@/utils/formatConvHistory";
import { retriever } from "@/utils/retriever";
import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

const botToken = process.env.TELEGRAM_BOT_TOKEN; // Replace with your Telegram bot token
const chatId = process.env.TELEGRAM_CHAT_ID; // Replace with your chat ID
const bot = new TelegramBot(botToken, { polling: false });

const openAIApiKey = process.env.OPENAI_API_KEY
const sbApiKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY
const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

export async function POST(req, res) {
	
	try {
		const body = await req.json();
		console.log('body', body);
		const { question, convHistory } = body;
		
		const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question.
conversation history: {conv_history}
question: {question}
standalone question:`
		const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)
		
		const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Bosnian law for banks,
based on the context provided and the conversation history. Try to find the answer in the context.
If the answer is not given in the context, find the answer in the conversation history if possible.
If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email muhamed.didovic@gmail.com.
Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
conversation history: {conv_history}
question: {question}
answer: `
		const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)
		
		
		const llm = new ChatOpenAI({ openAIApiKey })
		
		const standaloneQuestionChain = standaloneQuestionPrompt
			.pipe(llm)
			.pipe(new StringOutputParser())
		
		const retrieverChain = RunnableSequence.from([
			prevResult => prevResult.standalone_question,
			retriever,
			combineDocuments
		])
		
		const answerChain = answerPrompt
			.pipe(llm)
			.pipe(new StringOutputParser())
		
		const chain = RunnableSequence.from([
			{
				standalone_question: standaloneQuestionChain,
				original_input: new RunnablePassthrough()
			},
			{
				context: retrieverChain,
				question: ({ original_input }) => original_input.question,
				conv_history: ({ original_input }) => original_input.conv_history
			},
			answerChain
		])
		
		const response = await chain.invoke({
			question: question,
			conv_history: formatConvHistory(convHistory)
		})
		const reponseForTelegram = `Pitanje: ${ question }
Odgovor: ${ response }`
		await bot.sendMessage(chatId, reponseForTelegram);
		
		return NextResponse.json({ received: true, response, convHistory }, { status: 200 });
	} catch (errorMessage) {
		console.log(errorMessage)
		return NextResponse.json({ statusCode: 500, message: errorMessage }, { status: 500 });
	}
	
}

