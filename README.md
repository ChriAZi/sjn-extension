# SJ-Extension

## Prerequisites

- Setup [Node.js](https://nodejs.org/de) and [npm](https://www.npmjs.com/)
- Install [Plasmo](https://www.plasmo.com/)
- Create a [Firebase Project](https://firebase.google.com/docs/web/setup)
- Create a [Pinecone account](https://www.pinecone.io/)
- Create a [HuggingFace account](https://huggingface.co/)

## Folder Structure

- assets: contains all images, icons etc.
- src: contains all business logic and UI components

## Running the extension

After having setup your development environment as described above, follow these steps:

1. Install dependencies using `npm install`
2. Run plasmo following the instructions in their [docs](https://docs.plasmo.com/framework)

## Additional Notes

All credentials are managed using a `.env` file with the following structure:

```
# the embedding model to use
PLASMO_PUBLIC_MODEL_NAME=sentence-transformers/all-mpnet-base-v2
# your huggingface API key
PLASMO_PUBLIC_HF_API_KEY=YOURAPIKEY

# pinecone index name (can be anything)
PLASMO_PUBLIC_PC_INDEX_NAME=default
# your pinecone api key
PLASMO_PUBLIC_PC_API_KEY=YOURAPIKEY
# the pod region (indicated when setting up a pinceone account)
PLASMO_PUBLIC_PC_ENVIRONMENT=e.g. us-west1-gcp-free

# similarity search value -> choose below which value no recommendations should be shown
PLASMO_PUBLIC_SIM_CUTOFF=0.28829948855204757

# lab/field study setup
# set to true to work within the lab appliaction, set to false to work in the chrome extension
PLASMO_PUBLIC_LAB_STUDY=false

# Firebase credentials (explained when setting up a firebase project)
PLASMO_PUBLIC_FIREBASE_API_KEY=YOURAPIKEY
PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOURAUTHDOMAIN
PLASMO_PUBLIC_FIREBASE_PROJECT_ID=YOURPROJECT ID
PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOURSTORAGEBUCKET
PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=MESSAINGSENDERID
PLASMO_PUBLIC_FIREBASE_APP_ID=APPID
```
