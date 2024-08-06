# Descargo de Responsabilidad

La presente aplicación web, diseñada para interactuar con sus datos SQL, requiere una conexión a la base de datos y a un proveedor de inteligencia artificial (AI) para su funcionamiento adecuado. A continuación, se detalla la política de almacenamiento de datos:

1. **Datos no almacenados**:
   - **Configuración de la base de datos**: No se almacena información como la URL de la base de datos o el esquema. Por motivos de optimizacion del sistema se cargan en memoria la informacion que proporciona el esquema de la base de datos.
   - **Proveedor AI**: No se almacena la clave de API (apikey) del proveedor de AI.
   - **Configuraciones no almacenadas**: Con cada nueva sesión, es necesario configurar nuevamente la información mencionada en los puntos 1.1 y 1.2.
   - **Chats temporales**: Los chats temporales no almacenan su estado. Esto significa que no se guardan respuestas anteriores de ningún tipo ni forma en la sesión actual.
2. **Temporalidad de las sesiones**:
   - Cada sesión en nuestra aplicación web es completamente temporal. Esto implica que:
     - No se guardan registros de conexiones.
     - No se guardan respuestas previas.
     - No se guarda la configuración del cliente.
   - Este enfoque garantiza que la privacidad y la seguridad de los datos del cliente se mantengan, ya que no se almacena información sensible entre sesiones.
3. **Responsabilidad del usuario**:
   - Al leer y analizar todo el texto proporcionado, usted acepta que si configura cualquier apikey, URL de base de datos o conexiones que apunten a un ambiente productivo, es bajo su propio resguardo y responsabilidad de sus datos.
   - Nos comprometemos a no almacenar ni difundir de ninguna manera ningún dato necesario para el funcionamiento de la aplicación.

**Nota**: Todas las respuestas generadas son proporcionadas a través de un proveedor de AI. Estas respuestas pueden contener errores de generación; por lo tanto, se recomienda comprobar la información generada antes de tomar cualquier acción basada en la misma.

Lo anterior dicho respeta el derecho de sus datos y actúa como descargo de responsabilidad.
