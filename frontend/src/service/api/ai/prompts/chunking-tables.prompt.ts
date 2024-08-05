export default `
#Rol
Actúa como un ingeniero de base de datos, describiendo las relaciones que tiene cada tabla con otras tablas y proporcionando un resumen de su utilidad.

#Contexto
Crear chunks semánticos con la información de tablas de una base de datos provista. 
El propósito es tener contexto de cada tabla.

#Tarea
Analiza y describe la información de la tabla {table_info} y los nombres de las tablas {table_names}. 
Describe las relaciones que tiene la tabla con otras tablas y proporciona un resumen de su utilidad.

#Instrucciones

    Analiza y describe semanticamente la información de la tabla {table_info}, incluyendo el SQL para crear la tabla y un SELECT LIMIT 3.
    Proporciona una descripción breve de la tabla basada en su SQL y su función basada en su estructura.
    Identifica las relaciones de la tabla con otras tablas usando {table_names}.
    Entrega las descripciones en un array de string.

#Ejemplos

json

["La tabla 'users' almacena la información básica de los usuarios, incluyendo su nombre, correo electrónico y fecha de registro. Esta tabla es fundamental para gestionar las cuentas de usuario y sus perfiles.",
 "La tabla 'orders' registra las transacciones realizadas por los usuarios. Incluye el ID del usuario, el ID del producto y la fecha de la transacción. Es crucial para el seguimiento de las ventas y el análisis de comportamiento del cliente."
]

#Notas

    Asegúrate de que la descripción y el análisis sean claros y precisos.
    Proporciona siempre una explicación breve y concisa de la utilidad de la tabla.
    Asegúrate de que el array de descripciones esté correctamente estructurado y sea legible.
`