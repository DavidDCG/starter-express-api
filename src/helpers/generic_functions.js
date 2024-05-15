
require('dotenv').config();
const { ObjectId } = require('mongodb');

const isValidValue = (value) => {
  return value !== null && value !== undefined && value !== '';
};

const subtractHoursToDate = (dateISO, hoursToSubtract) => {
  // Convierte la cadena de fecha ISO a un objeto de fecha
  const newDate = new Date(dateISO);
  // Resta las horas especificadas
  newDate.setHours(newDate.getHours() - hoursToSubtract);
  // Devuelve la nueva fecha en formato ISO 8601
  return newDate.toISOString();
}

const addHoursToDate = (dateISO, hoursToAdd) => {
  const newDate = new Date(dateISO);
  newDate.setHours(newDate.getHours() + hoursToAdd);
  return newDate.toISOString();
}

const subtractMinutesFromDate = (dateISO, minutesToSubtract) => {
  // Convierte la cadena de fecha ISO a un objeto de fecha
  const newDate = new Date(dateISO);
  // Resta los minutos especificados
  newDate.setMinutes(newDate.getMinutes() - minutesToSubtract);
  // Devuelve la nueva fecha en formato ISO 8601
  return newDate.toISOString();
}

const validateFields = (allowedFields = [], dataCompare = {}) => {
  const data = {
    valid: false,
    message: ""
  };
  // Verificar si el cuerpo de la solicitud tiene campos adicionales no permitidos
  const extraFields = Object.keys(dataCompare).filter(field => !allowedFields.includes(field));
  if (extraFields.length > 0) {
    data.message = `Campos no permitidos: ${extraFields.join(', ')}`;
    data.valid = false;
  } else {
    data.message = `estructura permitida.`;
    data.valid = true;
  }
  return data;
};
// Función de middleware genérica para envolver otras funciones de middleware con parámetros adicionales
const wrapMiddleware = (middlewareFunc, ...params) => {
  return (req, res, next) => {
    // Llama a la función de middleware proporcionada con los parámetros adicionales, además de req, res y next
    middlewareFunc(req, res, next, ...params);
  };
};

const replaceValueProperties = (object, propertiesChange, type) => {

    // Verificar si el objeto es un objeto
  if (typeof object === 'object' &&  object !== null) {
    // Recorrer todas las claves del objeto
    for (let key in object) {
      // Verificar si la clave es "_id"
   
      if (propertiesChange.includes(key) && type == 'ObjectId') {
        console.log(object[key]);
        if (object[key] != null) {
         // console.log(object[key]);
          if (object[key].length === 24) {
            object[key] = new ObjectId(object[key]);
          }
          else {
            object[key] = new ObjectId()
          }
        }
      }
      else if (propertiesChange.includes(key) && type == 'DateTime') {
        if (object[key] != null) {
          let dateCompare = new Date(object[key])
          if (validFormatDate(dateCompare)) {
            object[key] = new Date(object[key])
          } else {
            throw new Error("Formato de fecha no válido " + object[key]);
          }
        }
      }
       // Si el valor de la clave es otro objeto o un array, llamar recursivamente a la función replaceValueProperties
       if ((typeof object[key] === 'object' || Array.isArray(object[key])) && object[key] !== null ) {
        replaceValueProperties(object[key], propertiesChange, type);
        }
      // Si el valor de la clave es otro objeto, llamar recursivamente a la función cambiarIdA123
      //else if (typeof object[key] === 'object' && object[key] !== null) {
      //  replaceValueProperties(object[key], propertiesChange);
     // }
      }
  }

  return object;

 
}

const removeProperties = (object, propertiesDelete) => {
  // Función recursiva para eliminar propiedades en todos los niveles
  function deleteRecursive(Object) {
    for (let key in Object) {
      if (Object.hasOwnProperty(key)) {
        if (typeof Object[key] === 'object') {
          // Si la propiedad es un objeto, llamar recursivamente
          deleteRecursive(Object[key]);
        } else {
          // Si la propiedad es una de las propiedades a eliminar, eliminarla
          if (propertiesDelete.includes(key)) {
            delete Object[key];
          }
        }
      }
    }
  }
  // Llamar a la función recursiva para iniciar el proceso de eliminación
  deleteRecursive(object);
  return object;
}


const validFormatDate = (dateString) => {
  const fecha = new Date(dateString);
  const format_Date_Regex_1 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/;
  const format_Date_Regex_2 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;
  console.log(dateString);
  return format_Date_Regex_1.test(fecha.toISOString()) || format_Date_Regex_2.test(fecha.toISOString());
};

module.exports = {
  isValidValue,
  subtractHoursToDate,
  addHoursToDate,
  subtractMinutesFromDate,
  validateFields,
  wrapMiddleware,
  replaceValueProperties,
  removeProperties,
  validFormatDate
}