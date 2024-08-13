# SocketBridge Event Listener

This Nest.js application listens to real-time bridging events from the `SocketGate` Contract on the Ethereum Mainnet, processes the events asynchronously, enriches the data with block and transaction details, caches token information, and stores the data in MongoDB. The application also provides REST APIs to fetch the latest transactions and aggregated data.

## Features

1. **Real-Time Event Listening**: Listens to real-time bridging events from the `SocketGate` Contract.
2. **Queue Processing**: Events are pushed into a queue (using BullMQ and Redis) and processed asynchronously.
3. **Data Enrichment**: Retrieves block details, transaction details, and token details for each event.
4. **Caching**: Token details are cached in Redis to avoid redundant lookups.
5. **Storage**: All events are stored in a MongoDB database. MongoDB was chosen as its easily scalable with horizontal scaling and data sharding unlike Postgres.
6. **REST APIs**: Exposes two APIs to fetch the latest transactions and aggregated data.

## APIs

### Get Latest Transactions
Retrieve the latest transactions.

`GET http://localhost:3000/socket-bridge/latest?count=5&offset=0`
- **Parameters:**
    - `count`: Number of transactions to retrieve (default: 5).
    - `offset`: Offset for pagination (default: 0).

### Get Aggregated Data
Retrieve aggregated data for each token and chain ID, sorted by the latest transaction.

`GET http://localhost:3000/socket-bridge/aggregated?sortKey=secondsSinceLastTxn&sortOrder=1`


- **Parameters:**
    - `sortKey`: The key to sort the results by (default: `secondsSinceLastTxn`). Other sort keys are `count`, `totalAmountBridged` and `totalGasCost`. 
    - `sortOrder`: The order of sorting (1 for ascending, -1 for descending).

## Prerequisites

- Docker
- Docker Compose

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arpan-jain/socket-bridge-listener.git
   cd socket-bridge-listener

2. **Start the application**:
Use Docker Compose to build and start the application:
    ```bash
   docker-compose up --build
   ```


