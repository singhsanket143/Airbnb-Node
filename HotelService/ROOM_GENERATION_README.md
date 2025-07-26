# Room Generation Background Job System

This system allows you to generate room records for a specific room category and date range using background jobs. It supports both immediate execution and scheduled jobs.

## Features

- **Immediate Room Generation**: Generate rooms instantly for a date range
- **Scheduled Jobs**: Schedule room generation for a future time
- **Background Processing**: Uses Redis-backed Bull queue for reliable job processing
- **Batch Processing**: Processes large date ranges in configurable batches
- **Job Monitoring**: Track job status and progress
- **Statistics**: Get room generation statistics and queue metrics

## Prerequisites

1. **Redis Server**: Required for job queue management
2. **Database**: MySQL/PostgreSQL with the required tables
3. **Node.js**: Version 16 or higher

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
```

3. Run database migrations:
```bash
npm run migrate
```

## Usage

### Starting the Worker

The background job worker processes room generation jobs. You can run it in several ways:

1. **Standalone Worker** (recommended for production):
```bash
npm run worker
```

2. **Development Mode** (with the main application):
```bash
npm run dev
```

### API Endpoints

#### 1. Generate Rooms

**POST** `/api/v1/room-generation`

Generate rooms for a room category and date range.

**Request Body:**
```json
{
  "roomCategoryId": 1,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z",
  "priceOverride": 150, // Optional: override default price
  "scheduleType": "immediate", // "immediate" or "scheduled"
  "scheduledAt": "2024-01-01T10:00:00.000Z" // Required for scheduled jobs
}
```

**Response (Immediate):**
```json
{
  "success": true,
  "message": "Room generation completed",
  "data": {
    "success": true,
    "totalRoomsCreated": 31,
    "totalDatesProcessed": 31,
    "errors": [],
    "jobId": "uuid-here"
  }
}
```

**Response (Scheduled):**
```json
{
  "success": true,
  "message": "Room generation job scheduled successfully",
  "data": {
    "jobId": "job-id-here",
    "scheduledAt": "2024-01-01T10:00:00.000Z",
    "estimatedCompletion": "2024-01-01T10:05:00.000Z"
  }
}
```

#### 2. Get Job Status

**GET** `/api/v1/room-generation/job/:jobId`

Check the status of a room generation job.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "job-id",
    "status": "completed", // waiting, active, completed, failed, delayed
    "progress": 100,
    "result": {
      "success": true,
      "totalRoomsCreated": 31,
      "totalDatesProcessed": 31,
      "errors": [],
      "jobId": "uuid-here"
    },
    "data": {
      "roomCategoryId": 1,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z"
    }
  }
}
```

#### 3. Get Queue Statistics

**GET** `/api/v1/room-generation/queue/stats`

Get overall queue statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "waiting": 2,
    "active": 1,
    "completed": 15,
    "failed": 0,
    "delayed": 3
  }
}
```

#### 4. Get Room Statistics

**GET** `/api/v1/room-generation/stats/:roomCategoryId?startDate=2024-01-01&endDate=2024-01-31`

Get room generation statistics for a specific room category.

**Response:**
```json
{
  "success": true,
  "data": {
    "roomCategoryId": 1,
    "dateRange": {
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z"
    },
    "totalRooms": 31,
    "availableRooms": 25,
    "bookedRooms": 6
  }
}
```

## Examples

### Example 1: Generate Rooms for Next Month

```bash
curl -X POST http://localhost:3000/api/v1/room-generation \
  -H "Content-Type: application/json" \
  -d '{
    "roomCategoryId": 1,
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-02-29T23:59:59.999Z",
    "scheduleType": "immediate"
  }'
```

### Example 2: Schedule Room Generation for Tomorrow

```bash
curl -X POST http://localhost:3000/api/v1/room-generation \
  -H "Content-Type: application/json" \
  -d '{
    "roomCategoryId": 1,
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-02-29T23:59:59.999Z",
    "scheduleType": "scheduled",
    "scheduledAt": "2024-01-31T02:00:00.000Z"
  }'
```

### Example 3: Check Job Status

```bash
curl http://localhost:3000/api/v1/room-generation/job/job-id-here
```

## Configuration

### Batch Size

You can configure the batch size for processing large date ranges by modifying the `batchSize` parameter in the job data. Default is 100 days per batch.

### Job Retry Configuration

Jobs are configured with:
- **Max Attempts**: 3
- **Backoff Strategy**: Exponential (2s, 4s, 8s)
- **Job Cleanup**: Completed jobs are removed after 100 jobs, failed jobs after 50 jobs

### Redis Configuration

The system uses Redis for job queue management. Ensure Redis is running and accessible with the configured connection parameters.

## Monitoring

### Logs

The system logs all job activities. Check the logs for:
- Job creation and scheduling
- Job processing progress
- Job completion/failure
- Queue statistics

### Health Checks

Monitor the worker process and Redis connection. The worker logs its status every 30 seconds when running.

## Error Handling

The system handles various error scenarios:
- Invalid room category ID
- Invalid date ranges (past dates, start >= end)
- Database connection issues
- Redis connection issues
- Job processing failures

All errors are logged and returned in the job result for debugging.

## Production Considerations

1. **Redis Persistence**: Configure Redis with persistence for job durability
2. **Worker Scaling**: Run multiple worker instances for high throughput
3. **Monitoring**: Set up monitoring for Redis, database, and worker processes
4. **Backup**: Regular backups of the database and Redis data
5. **Load Balancing**: Use load balancers for multiple API instances

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**: Check Redis server status and connection parameters
2. **Database Connection Failed**: Verify database credentials and connectivity
3. **Job Stuck**: Check worker logs and Redis queue status
4. **Memory Issues**: Monitor worker memory usage and adjust batch sizes

### Debug Commands

```bash
# Check Redis connection
redis-cli ping

# Check queue status
curl http://localhost:3000/api/v1/room-generation/queue/stats

# Check worker logs
tail -f logs/app.log
``` 