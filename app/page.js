// "use client";

import Image from 'next/image'
import Head from 'next/head'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"
import { retriever } from '@/utils/retriever'
import { combineDocuments } from '@/utils/combineDocuments'
import { formatConvHistory } from '@/utils/formatConvHistory'
import { Prompt } from "@/app/Prompt";

export const metadata = {
	title: "Floral Picker",
	description: "Floral Picker description",
	assets: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://fonts.googleapis.com/css2?family=Poppins&family=Roboto&display=swap']
};

export default function Home() {
	
	return (
		<div>
			<Head>
				<title>bank law</title>
				<link rel="preconnect" href="https://fonts.googleapis.com"/>
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins&family=Roboto&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<main>
				<section className="chatbot-container">
					<div className="chatbot-header">
						{/*<Image src="/images/logo-scrimba.svg" className="logo" alt="logo" width='160' height='100'/>*/}
						<p className="sub-heading">Knowledge Bank</p>
					</div>
					<div className="chatbot-conversation-container" id="chatbot-conversation-container">
					</div>
					
					
					<Prompt/>
				</section>
			</main>
		
		</div>
	
	)
}
