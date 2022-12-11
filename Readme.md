# TS Example Graphql API

This is a meeting room system API built on Apollo GraphQL + Typescript + Typeorm + PostgresSQL.

## Local Setup  
**1. Install all packages**

> `npm install`

> `npm build`

<br>

**2. Start local db**

> `cd infrastructure/local`

> `docker-compose up`

<br>

**3. Env variables**

- Create a .env file by using .env.example as a template
- Edit the configuration

<br>

**4. Auth0**

- Create an Auth0 account and create an application
- Save the necessary configuration in the .env
- Create some test users

<br>

**5. Run Migrations**

> `npm run migration:run`

<br>

**6. Start server**

> `npm start dev`

<br>

## AWS Infrastructure
All cloudformation files are in the infrastructure/aws folder. These are:

- **0_subnets**: Used to create a base VPC and networking routes to other envirnoment specific  VPCs

- **1_vpc**: this creates a dedicated environment VPC (staging)

- **2_openvpn-sg**: (optional) used to create the security groups for OpenVPN. In case you need to connect to the private VPC

- **3_ecs**: ECS cluster

- **4_api-base**: Api resources (db, security groups, etc.)

- **5_api-service**: Service container on ECS cluster

- **6_task-definition**: (Json) the fargate task definition which is deployed through the gitlab-ci
