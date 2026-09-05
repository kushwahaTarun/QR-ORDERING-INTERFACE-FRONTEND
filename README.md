# Dining House

For the owner and the kitchen. Guests scan a table card and use the customer site. This app is only for the team.

It uses the same restaurant database as the guest menu (`QR-Ordering-Interface-Backend`).

## What is inside

| Screen | Who | What it does |
| --- | --- | --- |
| Today | All staff | How service is going right now |
| Kitchen | All staff | New → cooking → ready → served |
| Menu | All staff | Dishes guests see after they scan a table card |
| Table cards | All staff | Print a card for each table |
| Guest book | All staff | Names and mobiles left for offers |
| Sales | Owner | Last seven days — what sold, when it was busy |
| This week | Owner | A short note from those orders |
| Restaurant | Owner | Name, hours, photos, GST |
| All restaurants | Main account | Every restaurant + add a new owner |

## Run locally

Customer site: `localhost:3000`  
API: `localhost:3001`  
This panel: **`localhost:3002`**

```bash
cd QR-Ordering-Interface-Backend
npx prisma db push
npm run seed:staff
npm run start:dev
```

```bash
cd QR-ORDERING-INTERFACE-FRONTEND
cp .env.example .env.local
npm install
npm run dev
```

`.env.local`:

```
API_BASE_URL=http://127.0.0.1:3001
```

On the API, `CORS_ORIGIN` should include `http://localhost:3002`.

## Demo accounts

Password for all: `HouseDemo@123`

| Email | Role |
| --- | --- |
| `owner@shagun.local` | Shagun owner |
| `kitchen@shagun.local` | Shagun floor / kitchen |
| `super@dining.local` | All restaurants |

`npm run seed:staff` is safe to re-run. It does **not** wipe restaurants or the guest menu.

## Deploy later

Same pattern as the customer site: Vercel for this app, Render for the API.

Set `API_BASE_URL` to the Render URL. Keep `ADMIN_JWT_SECRET` long (32+ characters) on the API.
