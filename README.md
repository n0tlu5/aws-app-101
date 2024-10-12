# Ikigai IO test

## Instructions

### Repository Setup

- Fork this repository to your own GitHub account.
- Clone the forked repository to your local machine.

### Implementation

- Create a React application for the frontend.
- Set up an api for the backend.
- Implement login pages using React for the frontend.
- Connect the React frontend to the api backend for authentication.
- Ensure the login functionality works correctly
- Make the application testable by running `docker compose up --build`.

### Final Steps

- Implement your changes and ensure everything is working as expected.
- Push your changes to your forked repository on GitHub.
- Share the link to your public forked repository with us once your implementation is complete.

## Approach

- Services are built in python/nodejs/go and reactjs
- Database is official mongodb/posgresql/mysql docker container
- Service images are built as needed
- docker-compose is used to orchestrate containers

## Assumptions

- docker and docker-compose are installed
- scripts are not being run from behind a proxy

## Notes

- Compromises were necessary due to the limited timeframe for completion items such as service polling for healthchecks with basic frontend/backend for login

## AWS

- A high level AWS arhitecture diagram

![architecture diagram](https://www.plantuml.com/plantuml/png/NP51JuD048Nl-ol6NjH3zUx1T0crqTIciIOUZ8S1feZ2BkuCbiRqlxiBJI2Ga30ptvitBonOq4bJbUf2FgaYm0FFhKEJawen_SQSOBPjah98OOr7SZFuK-2Vzur-XHKA7V3u0SXWKCvbFzTrxKKeXJMmjfX1X2MQb5n7OvceqyZ15RzUFB7GknLiYELf1thxsBk4aZNdOwALco-6X-MPQ7jYl3z6mGHvQl1iJMxZ2BIKo9swwZf9rr0dTGanxGj3a5fZA0rXM0r9OJxlalZNVzuFry4TlDX6YCFXuEYdyHCUSUsKspjhX4msmCEo81aV5bI46T--kI9eGperx0nuSEgfVWnNOY5QNgk5z_2_-ny0)

## Bouns (Infrastructure as code)

- Creating Load Balancer and EC2 with Auto Scaling Group using Terraform
