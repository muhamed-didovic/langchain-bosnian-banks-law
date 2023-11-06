import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
// import { createClient } from '@supabase/supabase-js'

import { client } from '../utils/supabaseClient';

const openAIApiKey = process.env.OPENAI_API_KEY
const sbApiKey = process.env.SUPABASE_API_KEY
const sbUrl = process.env.SUPABASE_URL

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
// const client = createClient(sbUrl, sbApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'banks',
    queryName: 'match_banks'
})

const retriever = vectorStore.asRetriever()

export { retriever }
