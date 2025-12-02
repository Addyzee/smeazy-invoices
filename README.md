# SMEazy Invoices
The simplest invoicing app  :)

Access at: https://smeazy-invoices.vercel.app

(Still updating docs...)

## To Run Locally
After cloning

#### Frontend
In the frontend folder:
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start server

Frontend will be running at `http://localhost:5173`


#### Environment Setup
Create a `.env` file in the backend folder. Use the `.env.example` as a reference.

### Options to run backend
You can either use docker or run it locally.

### 1. Running locally

#### Database
Run a Postgres instance. 

#### Backend
1. Install uv 
2. Run `uv sync` to install dependencies
3. Run `uvicorn app.main:app --reload` to start server

Backend will be running at `http://127.0.0.1:8000/`

You're ready! Interact with docs at `http://127.0.0.1:8000/docs`

Skip the next steps.


### 2. Using docker
This setup is used in production and uses a separate reverse proxy(Nginx) to route traffic(though it's not necessary, you can update ports in the compose file to expose the backend directly).

#### Steps
1. Install docker
2. Run `docker compose up --build` in the backend folder 

#### Nginx setup
Create a config file for nginx with the following content:
```
upstream invoices {
    server invoices-web:8000;
}

server {
    listen 80;

    location / {
        proxy_pass http://invoices;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Replace `invoices-web` with the name of your backend service in the docker compose file if different.

You're ready! Interact with docs at `http://localhost/docs`

Should you wish to use SSL, you can set up certbot with nginx. 

Feel free to reach out, or contribute in whatever way  :)
