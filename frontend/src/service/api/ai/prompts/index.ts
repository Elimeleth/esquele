import generateFeedbackPrompt from "./generate-feedback.prompt";
import sqlWriterPrompt from "./sql-writer.prompt";
import fixSqlPrompt from "./fix-sql.prompt";
import ragPrompt from "./rag.prompt";
import executePrompt from "./execute.prompt";
import explainSqlPrompt from "./explain-sql.prompt";
import discriminatorPrompt from "./discriminator.prompt";

//Cada prompt fue generado con chatgpt siguiendo la estructura de abajo, 
// este prompt necesita toda la informacion para crear el template 
// luego de ser recibida se debe tipear el comando START
/*
A continuación te entrego un prompt template.

Razona sobre cada una de sus partes y mantenlo en tu memoria dado que cuando digas la palabra "template cargado", te pasare toda la información que necesitas para realizar tu tarea

tu tarea será
Analizar la informacion que te daré luego de que el template sea cargado, con esa informacion debes entregar un prompt que se adapte a el template.
No crees el prompt sin haber recibido el comando "START"

El comando "START" indica que ya recibiste toda la informacion necesaria para cumplir tu tarea.
Siempre ejecuta tu tarea tan bien como puedas.

#--
Aqui abajo te entrego el template del prompt.
#Template Prompt:

Rol
Actua como un [AQUI DEBES DETALLAR TODO EL ROL QUE NECESITA EL PROMPT]

Contexto
[AQUI ESCRIBE Y ENFATIZA EL CONTEXTO SOBRE EL CUAL SE REALIZARA LA TAREA]

Tarea
[AQUI COMIENZA CON EL VERBO DE LA TAREA] [SIGUE CON LA DESCRIPCION PRECISA DE LA TAREA SIN AMBIGUEDADES Y LO MAS CLARA POSIBLE]

Instrucciones
[AQUI RAZONA SOBRE LA TAREA Y REDACTA UNA LISTA NUMERADA QUE NO SE PUEDE SALTAR DE CADA UNA DE LAS INSTRUCCIONES QUE SEAN NECESARIAS PARA LOGRAR LA TAREA DEBEN SER FACIL DE CUMPLIR Y BIEN EXPLICADAS MAXIMO 5 INSTRUCCIONES]

Ejemplos
[AQUI RAZONA SOBRE LA TAREA Y REDACTA UNA SERIE DE MAXIMO 4 EJEMPLOS EN FORMATO MD (#EJEMPLO 1 : [AQUI EL EJEMPLO 1]) Y ASI SUCESIVAMENTE]

Notas
[AQUI RAZONA SOBRE LA TAREA Y DEJA LA NOTAS MAS IMPORTANTES EN MODO REGLAMENTARIAS (ESTAS NOTAS DEBE SER A MODO DE LOGRAR MAS PRECISION EN EL MODELO POR ENDE DEBEN CUMPLIRSE SIEMPRE)]
#---


Si entendiste todo, di: Template cargado.
*/

export {discriminatorPrompt, ragPrompt, sqlWriterPrompt, executePrompt, generateFeedbackPrompt, fixSqlPrompt, explainSqlPrompt}