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
| GET | `/api/users/me` | Get user profile | Yes |
| POST | `/api/transactions/deposits` | Deposit funds | Yes |
| POST | `/api/transactions/transfers` | Transfer funds via CLABE | Yes |
| GET | `/api/transactions` | Get transaction history | Yes |
| GET | `/api/transactions/balance` | Get current balance | Yes |
| GET | `/api/metrics` | Prometheus metrics endpoint | No |

---

## Security Considerations
- SSH access is currently open to all IPs. In production, restrict port 22 to specific IP ranges.
- Prometheus and Node Exporter ports should be restricted to internal access only in a production environment.
- If you're thinking to use or adapt this project, consider to change the VPC ip's that are on the ingress/egress in order to avoid security problems
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

## AWS Deployment

The project is deployed on AWS EC2 (t3.micro) provisioned with Terraform.

![AWS Instance Running](./src/docs/aws-instance-running.png)

### Grafana Dashboard
![Grafana AWS Dashboard](./src/docs/grafana-aws-dashboard.png)

### Prometheus Targets
![Prometheus AWS](./src/docs/prometheus-aws.png)

### API Tests on AWS

#### Register
![Register](./src/docs/postman-test-register-endpoint-aws.png)

#### Login
![Login](./src/docs/postman-test-login-endpoint-aws.png)

#### Deposit
![Deposit](./src/docs/postman-test-deposits-endpoint-aws.png)

#### Transfer
![Transfer](./src/docs/postman-test-transfers-endpoint-aws.png)

#### Balance
![Balance](./src/docs/postman-test-transfers-getBalance-endpoint-aws.png)

## Github Actions CI/CD

This project has a CI/CD pipeline using three workflow files (ci-cd, docker, and terraform) in order to test and create a complete environment to run the project, using the correct credentials and configurations.

![3 Workflows](./src/docs/github-actions workflows.png)

> **Note:** AWS deployment URLs may change as the EC2 instance is restarted. The project can be run locally using `docker-compose up --build`.