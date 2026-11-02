# MongoDB Atlas Setup Guide

BillSnap's backend (`backend/`) uses MongoDB Atlas as its database. This guide
walks through creating a free cluster and getting the connection string into
`MONGO_URI`.

## 1. Create an account and project

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (or log in).
2. Create a new **Project** — name it `BillSnap`.

## 2. Create a free cluster

1. Click **Build a Database**.
2. Choose the **M0 Free** tier.
3. Pick a cloud provider/region close to your users (e.g. AWS Mumbai `ap-south-1`
   if most users are in India).
4. Name the cluster `billsnap-cluster` and click **Create**.

## 3. Create a database user

1. In **Database Access** (left sidebar), click **Add New Database User**.
2. Authentication method: **Password**.
3. Set a username (e.g. `billsnap-app`) and a strong generated password —
   save it somewhere safe, you'll need it for the connection string.
4. Under **Database User Privileges**, choose **Read and write to any database**.
5. Click **Add User**.

## 4. Allow network access

1. In **Network Access** (left sidebar), click **Add IP Address**.
2. For local development, click **Add Current IP Address**.
3. For deploying to Render (or any host with dynamic egress IPs), click
   **Allow Access From Anywhere** (`0.0.0.0/0`) — Atlas still requires the
   correct username/password, so this is safe as long as your database user
   password is strong and kept secret.

## 5. Get the connection string

1. Go to **Database** (left sidebar) → click **Connect** on your cluster.
2. Choose **Drivers**.
3. Select **Node.js** and the version shown.
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@billsnap-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with the database user you created
   in step 3, and add a database name before the `?`, e.g.:
   ```
   mongodb+srv://billsnap-app:YOUR_PASSWORD@billsnap-cluster.xxxxx.mongodb.net/billsnap?retryWrites=true&w=majority
   ```

## 6. Set it in your environment

- **Local development** — paste it into `backend/.env` as `MONGO_URI=...`
- **Render** — paste it as the `MONGO_URI` environment variable for the
  `billsnap-backend` service in the Render dashboard (see `render.yaml`,
  which marks it `sync: false` so you set it manually rather than committing
  it to source control).

## 7. Verify the connection

Run the backend locally and check the terminal:

```bash
cd backend
npm install
npm run dev
```

You should see:

```
[MongoDB] Connected: billsnap-cluster-shard-00-00.xxxxx.mongodb.net/billsnap
[BillSnap API] Listening on http://localhost:5000
```

If it hangs or errors instead, double-check:
- The password in the connection string doesn't contain characters that need
  URL-encoding (e.g. `@`, `:`, `/` — regenerate the password if so, or
  percent-encode them).
- Your current IP is allowed under **Network Access**.
- The database user has read/write privileges.

## 8. (Optional) Seed demo data

There is no seed script bundled by default — the Stage 1 frontend already
ships with realistic demo data for local exploration without a database.
Once you're ready to test against real data, sign up through `/signup` on
the frontend, which creates a real `User` document, then use the app (Rooms,
Appliances, Bill Upload) to populate the rest.
