# NovaBankAPI

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

This is my second DevOps project, building on top of what I learned in MetricsWatch. NovaBankAPI is a banking backend focused on cloud infrastructure, observability, and CI/CD automation.

---

## Background

NovaBank started as a fullstack banking application I built last year using the MERN stack and AWS. For this DevOps iteration, I kept the backend business logic and redesigned the project around infrastructure, monitoring, and automation.

---

## What is NovaBankAPI?

A banking backend API that allows users to register, authenticate, and perform simulated banking operations such as deposits and transfers between accounts.

All endpoints are protected with JWT authentication middleware. The API can be tested using Postman or Bruno.

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |
| GET | `/api/users/:id` | Get user information | Yes |
| POST | `/api/transactions/deposit` | Deposit funds | Yes |
| POST | `/api/transactions/transfer` | Transfer funds via CLABE | Yes |
| GET | `/api/transactions` | Get transaction history | Yes |
| GET | `/api/metrics` | Prometheus metrics endpoint | No |

---

## Security Considerations
- SSH access is currently open to all IPs. In production, restrict port 22 to specific IP ranges.
- Prometheus and Node Exporter ports should be restricted to internal access only in a production environment.

---

## DevOps Stack

| Tool | Purpose |
|------|---------|
| Express | Backend framework |
| Docker | Containerize all services |
| Terraform | Provision AWS infrastructure (EC2, VPC) |
| Prometheus | Scrape and store API metrics |
| Grafana | Visualize real-time dashboards |
| GitHub Actions | CI/CD pipeline |
| AWS EC2 | Host the application in the cloud |
| MongoDB Atlas | Cloud database |

---

## Getting Started

Clone the repository and run the following command from the root of the project:

```bash
docker-compose up --build
```

Once running, open your browser and go to:

- API: `http://localhost:4000`
- Metrics: `http://localhost:4000/api/metrics`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`

---

## CI/CD Pipeline

Every push to `main` triggers a GitHub Actions workflow that:

1. Installs dependencies
2. Runs tests
3. Builds the Docker image
4. Deploys to AWS EC2

---

## Screenshots

*(coming soon)*

> **Note:** AWS deployment URLs may change as the EC2 instance is restarted. The project can be run locally using `docker-compose up --build`.