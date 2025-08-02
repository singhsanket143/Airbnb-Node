## Steps to setup the starter template

1. Clone the project

```
git clone https://github.com/singhsanket143/Express-Typescript-Starter-Project.git <ProjectName>
```

2. Move in to the folder structure

```
cd <ProjectName>
```

3. Install npm dependencies

```
npm i
```

4. Create a new .env file in the root directory and add the `PORT` env variable

```
echo PORT=3000 >> .env
```

5. Start the express server

```
npm run dev
```

## Room Availability Extension Scheduler

The HotelService includes an automated room availability extension scheduler that runs every minute to ensure continuous room availability.

### How it works

1. **Automatic Extension**: The scheduler runs every minute using a cron job (`* * * * *`)
2. **Latest Date Detection**: For each room category, it finds the latest date of availability
3. **One Day Extension**: It automatically adds one more day to the latest availability date
4. **Queue Processing**: New room instances are added to the Redis queue for processing
5. **Duplicate Prevention**: The system checks for existing rooms before creating new ones

### API Endpoints

#### Start Scheduler
```http
POST /api/v1/scheduler/start
```
Starts the room availability extension scheduler.

#### Stop Scheduler
```http
POST /api/v1/scheduler/stop
```
Stops the room availability extension scheduler.

#### Get Scheduler Status
```http
GET /api/v1/scheduler/status
```
Returns the current status of the scheduler.

#### Manual Extension
```http
POST /api/v1/scheduler/extend
```
Manually triggers room availability extension for all room categories.

### Example Usage

```bash
# Start the scheduler
curl -X POST http://localhost:3000/api/v1/scheduler/start

# Check scheduler status
curl -X GET http://localhost:3000/api/v1/scheduler/status

# Manually trigger extension
curl -X POST http://localhost:3000/api/v1/scheduler/extend

# Stop the scheduler
curl -X POST http://localhost:3000/api/v1/scheduler/stop
```

### Configuration

The scheduler automatically starts when the server initializes. The cron expression is set to run every minute (`* * * * *`) and uses UTC timezone.

### Logging

The scheduler provides detailed logging for:
- Scheduler start/stop events
- Room category processing
- Job queue additions
- Error handling and recovery