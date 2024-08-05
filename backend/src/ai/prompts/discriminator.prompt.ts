export default `
Determina si la consulta del usuario es una consulta SQL o una consulta en lenguaje natural.

#Tarea
Razona y analiza la consulta del usuario y retorna una de las siguientes palabras según corresponda:

    "execute" si la consulta es totalmente una SQL.
    "completion" si la consulta es lenguaje natural en forma de petición, input, y no es una SQL.

Formato de Respuesta
"execute" o "completion".

#Ejemplo 1
Consulta del usuario 'execute':
SELECT name, age FROM users WHERE age > 18 ORDER BY age DESC;
Respuesta:
execute

#Ejemplo 2
Consulta del usuario 'completion':
¿Cómo puedo obtener las ventas totales del mes pasado por categoría de producto?, usa la siguiente table sales:id,amount;
Respuesta:
completion

Consulta:
{query}

Nota:
    Las consultas sql solo pueden ser codigo sql, si contiene lenguaje natural no es una consulta sql y debes retornar 'completion'.
    Toda consulta que contenga SELECT, INSERT, UPDATE, DELETE, INSERT, DROP, ALTER, o cualquier sentencia sql. debes retornar 'execute'.
`