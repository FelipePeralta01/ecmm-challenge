# Prueba técnica Junior Fullstack

Construye una aplicación sencilla para administrar un catálogo de productos. La
solución debe incluir una API REST en Django y una interfaz web que la consuma.

**Tiempo estimado de desarrollo:** 90 minutos.

Este tiempo es una referencia para dimensionar el alcance y no un límite de
ejecución. Se recomienda priorizar una solución simple, funcional y clara.

## Alcance

### API

La API debe permitir:

- Listar productos y consultar uno por su ID.
- Crear, editar y eliminar productos.
- Filtrar productos por categoría.
- Buscar productos por nombre.

Una **categoría** debe contener:
- nombre


Un **producto** debe contener:
- nombre
- descripción
- precio
- stock
- categoría
- fecha de creación

### Interfaz web

La interfaz debe permitir, como mínimo:

- Visualizar el listado de productos.
- Crear un producto mediante un formulario.
- Filtrar o buscar productos.

Puedes utilizar Next.js u otro framework basado en React. La elección queda a tu
criterio y debe ser adecuada al alcance de la solución.

## Reglas

- El backend debe utilizar Django y Django REST Framework.
- La base de datos debe ser SQLite.
- El nombre de cada categoría debe ser único.
- Nombre, precio, stock y categoría son obligatorios.
- El precio debe ser mayor o igual a cero.
- El stock debe ser un entero mayor o igual a cero.
- La categoría asociada debe existir.
- Los errores de validación deben devolver una respuesta HTTP apropiada y comprensible.

No se requiere autenticación, carrito de compras, órdenes, pagos ni despliegue.

## Entregables

- API e interfaz web funcionales.
- Migraciones de base de datos.
- Al menos dos pruebas automatizadas: creación correcta de un producto y rechazo
  de datos inválidos.
- Instrucciones completas para ejecutar el proyecto.

La organización de endpoints y la elección de herramientas adicionales quedan a
criterio del postulante.

## Uso de herramientas de IA

Puedes utilizar herramientas de IA como apoyo. Si lo haces, indícalo brevemente
en tus anotaciones junto con el propósito para el que las utilizaste. Debes
comprender todo el código presentado; estas herramientas no reemplazan el dominio
de la solución.

## Proceso de entrega

Realiza un fork de este repositorio y desarrolla allí tu solución. Al finalizar,
comparte el enlace público al fork según las instrucciones recibidas.

El plazo para enviar la solución es de **cinco días corridos** desde la recepción
de la prueba. Una vez vencido ese plazo, no se recibirán nuevas entregas.

## Criterios de evaluación

- Cumplimiento de los requisitos y funcionamiento de los endpoints.
- Uso adecuado de modelos, serializers y vistas.
- Integración entre la interfaz y la API.
- Elección de herramientas acorde con el alcance solicitado.
- Claridad, organización y comprensión del código.
- Calidad de las validaciones, pruebas y documentación.

---

## Anotaciones del postulante

### Instrucciones de ejecución

Para levantar la aplicación se necesitan dos terminales: una para el backend y otra para el frontend.

## 1. Backend (Django)

### Instalar dependencias del proyecto
uv sync

### Correr migraciones
uv run python manage.py migrate

### Ejecutar los tests unitarios
uv run python manage.py test tests

### Levantar la API
uv run python manage.py runserver


## 2. Frontend (Next.js)

### Instalar paquetes
npm install

### Iniciar en modo desarrollo
npm run dev

---

### Decisiones y observaciones

- **Uso de `uv` en el backend:** Opté por `uv` como gestor de paquetes de Python en lugar del clásico `pip + venv` tradicional. Es notablemente más rápido al instalar librerías y el archivo `uv.lock` asegura que el entorno sea idéntico al momento de evaluar la prueba.
- **Estructura simple y modular:** Mantuve todo el dominio del catálogo dentro de una sola app de Django (`catalog`). Dado el tiempo y alcance de la prueba, crear múltiples apps habría sido sobreingeniería innecesaria.
- **ViewSets y DRF:** Usé `ModelViewSet` para productos y categorías porque resuelve el CRUD estándar de manera muy limpia y testeable. Para los filtros integré `django-filter`, permitiendo filtrar por categoría (`?category=id`) y buscar por texto (`?search=texto`) sin ensuciar la lógica de las vistas.
- **Modelos y tipos de datos:** Para el precio usé `DecimalField` en lugar de `FloatField` para evitar errores de redondeo que suelen ocurrir con números flotantes cuando se maneja dinero. Las validaciones de valores mayores o iguales a cero las reforcé tanto en el modelo (`MinValueValidator`) como en el serializer para devolver errores 400 descriptivos al cliente.
- **Frontend con TanStack Query y TypeScript:** Decidí usar Next.js con TypeScript para tener tipado estricto en los modelos de producto y respuestas de la API. Incorporé TanStack Query (`@tanstack/react-query`) porque simplifica mucho el manejo de estados asíncronos (loading, error) y permite refrescar automáticamente la grilla al crear o eliminar un producto mediante la invalidación de queries.
- **Mejoras pendientes:** Me gustaría agregar paginación en el backend (pensando en catálogos grandes), notificaciones tipo *toast* en la UI para confirmar acciones de guardado, y una suite de pruebas frontend usando Vitest o React Testing Library.
- **Como limitación:** No se debería eliminar una categoría que tenga productos asociados, ya que existe una relación entre ambas entidades y borrar la categoría dejaría productos apuntando a una referencia inexistente. Esta decisión mantiene la integridad de los datos y evita inconsistencias en el catálogo. Como mejora a esta limitación, se podría ocultar la categoría creando una columna nueva como tipo boolean para evitar eliminarla de la BD.

---

### Herramientas de IA utilizadas

Se utilizó la herramienta Antigravity 2.0 con la IA de Gemini para gestionar el diseño de la UI del frontend. Se utilizó dentro del backend para apoyo en la creación de la arquitectura, se usó como apoyo para la resolución de errores de código y para finalmente realizar rápidamente la documentación del proyecto.

Todo lo que esta herramienta de IA me propuso fue revisado y aplicado por mi mismo, manteniendo a la IA solo como un apoyo para la solución.