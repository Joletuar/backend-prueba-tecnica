# 📊 Stock Recommendations API

API de recomendaciones de acciones con algoritmo inteligente de análisis.

## 🚀 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Configurar base de datos
pnpm db:migrate
pnpm db:generate

# Popular la base de datos (opcional)
pnpm db:populate

# Ejecutar en desarrollo
pnpm dev
```

## Documentación de la API

La API cuenta con documentación interactiva usando Swagger/OpenAPI 3.0:

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs) - Interfaz visual para explorar y probar los endpoints
- **OpenAPI JSON**: [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json) - Especificación completa en formato JSON

## 📚 API Endpoints

### Stocks

#### GET /api/v1/stocks

Obtener listado de acciones con paginación y filtros.

**Query Parameters:**

- `limit`: Elementos por página (1-100, default: 10)
- `next/prev`: Cursores de paginación
- `search`: Buscar por ticker o compañía
- `brokerage`: Filtrar por brokerage
- `sortOrder`: `asc` o `desc` (default: `desc`)
- `sortField`: `time` o `action` o `brokerage`

**Respuesta:**

```json
{
  "data": [
    {
      "id": "01HZBQR8K9XYZ123456789",
      "ticker": "AAPL",
      "companyName": "Apple Inc.",
      "brokerage": "Goldman Sachs",
      "action": "Buy",
      "ratingFrom": "Hold",
      "ratingTo": "Buy",
      "targetFrom": 150.0,
      "targetTo": 180.0,
      "time": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": { "next": "cursor-next", "prev": null },
    "timestamp": "Mon, 28 Jul 2025 10:30:00 GMT",
    "requestId": "req-123"
  }
}
```

#### GET /api/v1/stocks/brokerages

Obtener lista de brokerages disponibles.

**Respuesta:**

```json
{
  "data": ["Goldman Sachs", "JP Morgan", "Morgan Stanley"],
  "meta": {
    "timestamp": "Mon, 28 Jul 2025 10:30:00 GMT",
    "requestId": "req-124"
  }
}
```

#### GET /api/v1/stocks/:id

Obtener una acción por ID.

**Respuesta:**

```json
{
  "data": {
    "id": "01HZBQR8K9XYZ123456789",
    "ticker": "AAPL",
    "companyName": "Apple Inc.",
    "brokerage": "Goldman Sachs",
    "action": "Buy",
    "ratingFrom": "Hold",
    "ratingTo": "Buy",
    "targetFrom": 150.0,
    "targetTo": 180.0,
    "time": "2024-01-15T10:30:00Z"
  }
}
```

### Análisis de Acciones

#### POST /api/v1/stock-analyst/generate

Generar análisis de recomendaciones para todas las acciones.

**Respuesta:**

```json
{
  "data": {
    "totalGenerated": 150,
    "message": "Successfully generated 150 recommendations"
  }
}
```

#### GET /api/v1/stock-analyst/best

Obtener la mejor recomendación disponible.

**Respuesta:**

```json
{
  "data": {
    "id": "01HZBQR8K9XYZ123456789",
    "stockId": "01HZBQR8K9XYZ123456788",
    "currentPrice": 160.5,
    "potentialGrowth": 24.6,
    "score": 38.5,
    "reason": "Recomendado porque Goldman Sachs mejoró el rating de Neutral a Buy..."
  }
}
```

#### GET /api/v1/stock-analyst/stock/:stockId

Obtener análisis para una acción específica.

**Respuesta:**

```json
{
  "data": [
    {
      "id": "01HZBQR8K9XYZ123456789",
      "stockId": "01HZBQR8K9XYZ123456788",
      "currentPrice": 160.5,
      "potentialGrowth": 24.6,
      "score": 38.5,
      "reason": "Análisis detallado de la recomendación..."
    }
  ]
}
```

## 🧠 Algoritmo de Recomendaciones

Algoritmo inteligente que evalúa múltiples factores para generar recomendaciones:

- **Mejora de Rating (40%)**: Evalúa cambios en calificaciones de analistas
- **Potencial de Crecimiento (30%)**: Compara precio actual vs precio objetivo
- **Tipo de Acción (20%)**: Pondera según el tipo de recomendación
- **Recencia (10%)**: Prioriza análisis más recientes

## 🏗 Tecnologías

- **Backend**: Node.js + TypeScript + Express
- **Base de Datos**: CockroachDB + Prisma ORM
- **Arquitectura**: Clean Architecture
- **Validación**: Zod schemas
- **Testing**: Jest + Supertest

## 🚀 Servidor

Ejecutar `pnpm dev` para iniciar en modo desarrollo.
Servidor disponible en: `http://localhost:3000`
