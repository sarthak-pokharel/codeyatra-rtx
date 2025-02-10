# 🌾 Agrifusion

Agrifusion is a web application designed to bridge the gap between farmers, businesses, and agricultural experts. It empowers farmers by providing direct access to buyers, industry professionals, and valuable resources, fostering a more sustainable and digitally connected agricultural ecosystem.

## 🚀 Features

- **Farmer-Business Marketplace** – Connects farmers with businesses for direct trade.

- **Expert Consultation** – Farmers can interact with agricultural experts for guidance.

- **Sustainable Farming Resources** – Access to best practices and knowledge-sharing.

- **Community Forum** – A space for discussions and knowledge exchange.

## 🎯 Sustainable Development Goals (SDGs)

Agrifusion aligns with:

- **SDG 2: Zero Hunger** – Enhancing agricultural productivity.
- **SDG 8: Decent Work & Economic Growth** – Supporting fair trade for farmers.
- **SDG 9: Industry, Innovation, and Infrastructure** – Promoting digital solutions in agriculture.

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (React)
- **Backend**: Node.js, Express
- **Database**:My SQL
- **Authentication**: JWT-based authentication



## 🚀 Setup Instructions

1. Clone the repository

2. Install and configure MySQL Server:
   - Download MySQL Server from [official website](https://dev.mysql.com/downloads/mysql/)
   - Install MySQL Server and MySQL Workbench
   - Create a new database named `agrifusion`:
   ```sql
   CREATE DATABASE agrifusion;
   ```

3. Configure database connection  in `.env` file:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=agrifusion
```
4. Execute the database schema:
   - Open MySQL terminal or MySQL Workbench or Phpmyadmin admin panel
   - Connect to the `agrifusion` database:
   ```sql
   USE agrifusion;
   ```
   - Execute the schema file:
   `source path/to/dbschema.sql;`

5. Add your OpenAI API key to `.env` file in the server directory:

```OPENAI_API_KEY=your_api_key_here```

6. Add your Sparrow SMS token API key to `.env` file in the server directory:

```SPARROW_SMS_TOKEN=your_api_key_here```

7. Run the following commands to start the application:
```bash
cd client-v2
npm run build
cd ..\server
npm start
```



