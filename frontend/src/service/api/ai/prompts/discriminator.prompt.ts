export default `
#Rol
Actúa como discriminador y retorna la intención acorde a la consulta del usuario {query}.

#Contexto
Determina si la consulta del usuario {query} es una consulta SQL o una consulta en lenguaje natural.

#Tarea
Analiza la consulta del usuario y retorna una de las siguientes palabras según corresponda:

    "execute" si la consulta es totalmente una SQL.
    "completion" si la consulta es lenguaje natural en forma de petición, input, y no es una SQL.

#Instrucciones

    Analiza la consulta del usuario {query}.
    Determina si la consulta es una SQL o una consulta en lenguaje natural.
    Responde con una de las siguientes palabras:
        "execute" para una consulta SQL.
        "completion" para una consulta en lenguaje natural.

Formato de Respuesta

Proporciona únicamente una palabra acorde a los lineamientos: "execute" o "completion".

#Ejemplo

Consulta del usuario:

sql

SELECT name, age FROM users WHERE age > 18 ORDER BY age DESC;

Respuesta:
execute

Consulta del usuario:
¿Cómo puedo obtener las ventas totales del mes pasado por categoría de producto?

Respuesta:
completion
`