// Definir el esquema JSON
const schemainsertTask = {
    "type": "object",
    "properties":  
    {
        title: { type: 'string' },
        icon_path: { type: 'string' },
        content: { type: 'string' },
        attachments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              archive_name: { type: 'string' },
              extension: { type: 'string' },
              url: { type: 'string' }
            },
            additionalProperties: false,
            required: ['archive_name', 'extension', 'url']
          }
        },
        expiration_amount: { type: 'integer' },
        has_expiration: { type: 'boolean' },
        expiration_time: { enum: ['D','S','A',''] },
        expiration_sequence: { enum: ['before', 'after',''] },
        category_id: { bsonType: 'objectId' },
        send_notification: { type: 'boolean' },
        segmentation_type: { type: 'boolean' },
        segmentation: {
          type: 'object',
          properties: {
            areas: {
              type: 'array',
              items: { bsonType: 'objectId' }
            },
            branches: {
              type: 'array',
              items: { bsonType: 'objectId' }
            },
            companies: {
              type: 'array',
              items: { bsonType: 'objectId' }
            },
            type_collaborators: {
              type: 'array',
              items: { bsonType: 'objectId' }
            }
          },
          additionalProperties: false,
          required: ['areas', 'branches', 'companies', 'type_collaborators']
        },
        create_date: { bsonType: 'date', description: 'debe ser una fecha y es obligatorio' },
        update_date: { bsonType: 'date', description: 'debe ser una fecha y es obligatorio' },
        autoAssign: { type: 'boolean' },
        type_assignment: { enum: ['C','A','R','T',''] },
        from: { bsonType: 'date' },
        to: { bsonType: 'date' },
        priority:  { enum: ['low', 'high'] },
        active:  { type: 'boolean' },
        order: { type: 'integer' },
        evaluation_id:  { anyOf: [{ type: 'string' }, { type: 'null' }] }
      }    
    ,
    "required": [
    'title',
    'icon_path',
    'content',
    'attachments',
    'expiration_amount',
    'has_expiration',
    'expiration_time',
    'expiration_sequence',
    'category_id',
    'send_notification',
    'segmentation_type',
    'segmentation',
    'autoAssign',
    'type_assignment',
    'from',
    'to',
    'priority',
    'order',
    'evaluation_id'
   ],
   additionalProperties: false
  };


  const dataUpdateTask = [
    'title',
    'icon_path',
    'content',
    'attachments',
    'expiration_amount',
    'has_expiration',
    'expiration_sequence',
    'category_id',
    'send_notification',
    'segmentation_type',
    'segmentation',
    'autoAssign',
    'type_assignment',
    'from',
    'to',
    'priority',
    'expiration_time'
  ]

    const schemaEvaluations = {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "questionnaire": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "_id": { "type": "string" },
              "title": { "type": "string" },
              "description": { "type": "string" },
              "questions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": "string" },
                    "question": { "type": "string" },
                    "response_type": { enum: ['text', 'numeric','opcm','opcu'] },
                    "mandatory": { "type": "boolean" },
                    "answers": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "_id": { "type": "string" },
                          "option": { "type": "string" }
                        },
                        "required": ["_id", "option"]
                      }
                    },
                    "evaluation": { "type": "boolean" },
                    "correct_answers": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "_id": { "type": "string" },
                          "option": { "type": "string" }
                        },
                        "required": ["_id", "option"]
                      }
                    },
                    "points": { "type": "integer" },
                    "explanation": { "type": "string" }
                  },
                  "required": ["_id", "question", "response_type", "mandatory", "answers", "evaluation", "correct_answers", "points", "explanation"]
                }
              }
            },
            "required": ["title", "description", "questions", "_id"]
          }
        }
      },
      "required": ["name", "questionnaire"]
    }
    

    const schemaEvaluationsAnswers = {
      "type": "object",
      "properties": {
        "evaluation_id": { "type": ["string", "null"] ,"pattern": "^[0-9a-fA-F]{24}$" },
        "user_id": { "type": ["string", "null"] ,"pattern": "^[0-9a-fA-F]{24}$"},
        "answers_register": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "question_id": { "type": ["string", "null"] ,"pattern": "^[0-9a-fA-F]{24}$"},        
              "answers":  {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": ["string", "null"],"pattern": "^[0-9a-fA-F]{24}$|^$"   
                  },
                
                    "option": { "type": "string" }
                  },
                  "required": ["_id", "option"]
                }
              },
              "points": { "type": ["integer", "null"] }
            },
            "required": ["question_id", "answers", "points"],
            "additionalProperties": false
          }
        }
      },
      "required": ["evaluation_id","user_id", "answers_register"],
      "additionalProperties": false
    }

module.exports = {
    schemainsertTask,
    schemaEvaluations,
    dataUpdateTask,
    schemaEvaluationsAnswers
};




 