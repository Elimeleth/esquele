import { DocumentCompressorPipeline } from "langchain/retrievers/document_compressors";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { EmbeddingsFilter } from "langchain/retrievers/document_compressors/embeddings_filter";

export function semanticFilterRetriever(args: {
    vectorStore: any,
    model?: any
    embedding: any
}) {

    const { vectorStore, embedding } = args;

    const embeddingFilter = new EmbeddingsFilter({
        embeddings: embedding,
        similarityThreshold: .55,
        k: 5
    })

    const baseCompressor = new DocumentCompressorPipeline({
        transformers: [embeddingFilter],
      });

    const retriever = new ContextualCompressionRetriever({
        baseCompressor,
        baseRetriever: vectorStore.asRetriever(8),
    });

    return retriever
}