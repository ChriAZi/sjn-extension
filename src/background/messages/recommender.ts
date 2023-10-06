import { PineconeClient } from '@pinecone-database/pinecone'

import { type FeatureExtractionOutput, HfInference } from '@huggingface/inference'
import type { PlasmoMessaging } from '@plasmohq/messaging'

/**
 * Gets a request for a reocmmendation from the frontend and returns a recommendation object
 * Loads articles from the respective components data-properties when using the lab application
 * Else loads them from the pinecone database
 * @param req - the request containing an embedding of a TJ-headline to compare to the SJ-articles in the pinceonce database
 * @param res - the response sent back to the frontend including the relevant SJ-article
 */
const handler: PlasmoMessaging.MessageHandler = async (req: PlasmoMessaging.Request, res: PlasmoMessaging.Response) => {
  const index = await setupPineCone()
    .catch(() => {
      res.send('error')
    })
  if (process.env.PLASMO_PUBLIC_LAB_STUDY === 'true') {
    const recommendation = await index.query({
      queryRequest: {
        topK: 1,
        includeMetadata: true,
        vector: req.body.embedding,
        filter: { title: { $eq: req.body.sjTitle } }
      }
    }).catch(() => {
      res.send('error')
    })

    if (recommendation !== undefined) {
      const matches = recommendation.matches
      if (matches[0] !== undefined) {
        const metadata = matches[0].metadata

        const article = {
          title: metadata.title,
          description: metadata.description,
          newsOutlet: metadata.news_outlet,
          publicationDate: metadata.publication_date,
          url: metadata.url,
          show: true
        }

        res.send({
          article
        })
      } else {
        const recommendation = await index.query({
          queryRequest: {
            topK: 1,
            includeMetadata: true,
            vector: req.body.embedding
          }
        }).catch(() => {
          res.send('error')
        })
        if (recommendation !== undefined) {
          const metadata = recommendation.matches[0].metadata

          const article = {
            title: metadata.title,
            description: metadata.description,
            newsOutlet: metadata.news_outlet,
            publicationDate: metadata.publication_date,
            url: metadata.url,
            show: true
          }

          res.send({
            article
          })
        }
      }
    } else {
      res.send('error')
    }
  } else {
    const hfClient = setupHuggingFace()
    const sourceString = req.body.title
    const embeddedSourceString = await getEmbedding(hfClient, sourceString)
      .catch(() => {
        res.send('error')
      })

    const recommendation = await index.query({
      queryRequest: {
        topK: 1,
        includeMetadata: true,
        vector: embeddedSourceString
      }
    }).catch(() => {
      res.send('error')
    })

    if (recommendation !== undefined) {
      const metadata = recommendation.matches[0].metadata
      const show = Number(recommendation.matches[0].score) >= (process.env.PLASMO_PUBLIC_SIM_CUTOFF as unknown as number)

      const article = {
        title: metadata.title,
        description: metadata.description,
        newsOutlet: metadata.news_outlet,
        publicationDate: metadata.publication_date,
        url: metadata.url,
        show
      }

      res.send({
        article
      })
    } else {
      res.send('error')
    }
  }
}

export default handler

/**
 * Connects to the pinecone database
 * Creates an index if it was shutdown after not using it for 2 weeks (only necessary in the free tier)
 */
async function setupPineCone (): Promise<any> {
  const pinecone = new PineconeClient()

  await pinecone.init({
    environment: process.env.PLASMO_PUBLIC_PC_ENVIRONMENT as string,
    apiKey: process.env.PLASMO_PUBLIC_PC_API_KEY as string
  }).catch(error => {
    throw error
  })

  const indexList = await pinecone.listIndexes()
    .catch(error => {
      throw error
    })
  let index

  if (typeof indexList[0] !== 'undefined') {
    index = pinecone.Index(indexList[0])
  } else {
    const indexName = process.env.PLASMO_PUBLIC_PC_INDEX_NAME as string
    await pinecone.createIndex({
      createRequest: {
        name: process.env.PLASMO_PUBLIC_PC_INDEX_NAME as string,
        dimension: 768,
        sourceCollection: process.env.PLASMO_PUBLIC_PC_INDEX_NAME
      }
    }).catch(error => {
      throw error
    })
    index = pinecone.Index(indexName)
  }
  return index
}

/**
 * Connect to HuggingFace
 */
function setupHuggingFace (): HfInference {
  return new HfInference(process.env.PLASMO_PUBLIC_HF_API_KEY)
}

/**
 * Get an embedding from an input string (TJ-headline in this case)
 * @param hfClient - the huggingface client
 * @param inputString - an input string to be embedded
 */
async function getEmbedding (hfClient: HfInference, inputString: string): Promise<FeatureExtractionOutput> {
  return await hfClient.featureExtraction({
    model: process.env.PLASMO_PUBLIC_MODEL_NAME,
    inputs: inputString
  }).catch(error => {
    throw error
  })
}
