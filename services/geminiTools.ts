import { FunctionDeclaration, Type } from '@google/genai';

// 1. Get Drive File Metadata
export const get_drive_file_metadata: FunctionDeclaration = {
  name: 'get_drive_file_metadata',
  description: 'Finds the target document for review in Google Drive based on a search query.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'The search query to find the file, such as the file name, keywords, or owner.'
      },
    },
    required: ['query'],
  },
};

// 2. Read Document Content
export const read_document_content: FunctionDeclaration = {
  name: 'read_document_content',
  description: 'Retrieves the text content of a specific Google Drive document for analysis.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      fileId: {
        type: Type.STRING,
        description: 'The unique ID of the Google Drive file.'
      },
    },
    required: ['fileId'],
  },
};

// 3. Suggest Document Edits
export const suggest_document_edits: FunctionDeclaration = {
  name: 'suggest_document_edits',
  description: 'Prompts the user with a summary and suggested edits for the provided document content.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: 'A concise summary of the document\'s content.'
      },
      edits: {
        type: Type.ARRAY,
        description: 'A list of specific edits to suggest to the user.',
        items: {
            type: Type.OBJECT,
            properties: {
                original_text: {
                    type: Type.STRING,
                    description: 'The segment of original text to be replaced.'
                },
                suggested_change: {
                    type: Type.STRING,
                    description: 'The new text to replace the original segment.'
                },
                comment: {
                    type: Type.STRING,
                    description: 'An explanation for why the edit is being suggested.'
                }
            },
            required: ['original_text', 'suggested_change', 'comment']
        }
      },
    },
    required: ['summary', 'edits'],
  },
};

// Consolidated function schema for the tools config
export const documentReviewTools = {
    functionDeclarations: [
        get_drive_file_metadata,
        read_document_content,
        suggest_document_edits,
    ]
};
