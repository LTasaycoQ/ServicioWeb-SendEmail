# API Peru Luxury Journeys & Terra Andina Hotel

API para manejar formularios de contacto y suscripciones con verificación de Turnstile.

## Endpoints

### POST /contact
Envío de solicitud de itinerario

### POST /subscribe
Registro de suscripciones

### POST /form-terra
Formulario de contacto del hotel

### GET /health
Health check del servicio

## Variables de entorno requeridas

- `EMAIL_USER_1`: Cuenta Gmail para Peru Luxury
- `EMAIL_PASS_1`: Contraseña de aplicación Gmail
- `EMAIL_USER_2`: Cuenta Gmail para Terra Andina
- `EMAIL_PASS_2`: Contraseña de aplicación Gmail
- `TURNSTILE_SECRET_PERU_LUXURY`: Secret key de Cloudflare Turnstile
- `TURNSTILE_SECRET_TERRA_ANDINA`: Secret key de Cloudflare Turnstile
- `DESTINATION_EMAIL`: Email destino para recibir notificaciones