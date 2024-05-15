// Definir el esquema JSON
const schemaInsertArea = {
    "type": "object",
    "properties": {
        "code_area": { "type": "string" },
        "name": { "type": "string" },
        "company_id": { "type": "string" }
    },
    "required": ["code_area", "name", "company_id"]
};

const schemaUpdateArea = {
    "type": "object",
    "properties": {
        "code_area": { "type": "string" },
        "name": { "type": "string" },
        "company_id": { "type": "string" }
    }
};

// Definir el esquema JSON
const schemaInsertBranch = {
    "type": "object",
    "properties": {
        "code_branch": { "type": "string" },
        "name": { "type": "string" },
        "company_id": { "type": "string" }
    },
    "required": ["code_branch", "name", "company_id"]
};

// Definir el esquema JSON
const schemaUpdateBranch = {
    "type": "object",
    "properties": {
        "code_branch": { "type": "string" },
        "name": { "type": "string" },
        "company_id": { "type": "string" }
    }
};


// Definir el esquema JSON
const schemaInsertCompany = {
    "type": "object",
    "properties": {
        "cvecia": { "type": "string" },
        "name_company": { "type": "string" }
    },
    "required": ["cvecia", "name_company"]
};

// Definir el esquema JSON
const schemaUpdateCompany = {
    "type": "object",
    "properties": {
        "cvecia": { "type": "string" },
        "name_company": { "type": "string" }
    }
};


// Definir el esquema JSON
const schemaCategory = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "description": { "type": "string" },
        "img_path": { "type": "string" },
        "order": { "type": ["integer", "null"] }
    },
    "required": ["name", "description","img_path", "order"]
};

const dataUpdateCategory = ["name","description","img_path", "active", "order"]


module.exports = {
    schemaInsertArea,
    schemaUpdateArea,
    schemaInsertBranch,
    schemaUpdateBranch,
    schemaInsertCompany, 
    schemaUpdateCompany,
    schemaCategory,
    dataUpdateCategory   
};