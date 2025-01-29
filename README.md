# DevSquad - CS400 Group Project

## Instructions for running the app locally

- Ensure you have Git installed on your machine
- Ensure you have Docker installed on your machine
- Clone this repository locally

In your terminal, CD into the cloned repository and run the commands below to build the docker image and start running the containerized application on port 3000:

```bash
cd application
```

```bash
docker build -t <name> .
```

```bash
docker run -it --init -p 3000:3000 <name>
```

## Part One: The Idea

### What is the product?

BreadSheet is a web application for users to input and quickly analyze their budget, including income sources and expenses. It is designed as a utility that can be bookmarked in the user's browser and used efficiently, without the need to sign up for an account or go through a setup process. The product aims to be a simple, effective, and user-friendly solution for getting an at-a-glance overview of the user's finances.

### What are possible names of the product?

- **[Name option 1]** SpendSense
- **[Name option 2]** budgbud
- **[Name option 3]** BreadSheet

### Who are the potential customers, end users, or buyers?

The potential end users of BreadSheet are:

- **Target Audience 1**: Everyday citizens seeking help balancing their budget
- **Target Audience 2**: Self employed entrepreneurs
- **Target Audience 3**: Small businesses

### What are the potential features, functions, or other important details that would be appealing to customers, end users, or buyers?

Here are the key features and functions of BreadSheet that would appeal to potential customers and users:

- **Feature 1**: Fields for inputting a variety of monthly income and expenses with amounts, sources, etc.
- **Feature 2**: A user-friendly interface and output of income/expenses/totals (charts/graphs?)
- **Feature 3**: An option to quickly output/download the financial data as a PDF document

---

## Product Vision Statement

**Vision Statement:**
For anyone who could benefit from a simple and high-level overview of their finances, BreadSheet is a budgeting tool that allows quick input and output of financial information for the user's records. Unlike subscription services, products that require set up, or that save/sell/have control over your data with no interoperability, BreadSheet is fast, easy, and will store data temporarily and only if the user chooses.
