# You Feel We Feel API Documentation

## Overview
This API allows you to track and manage feelings, connect with friends, and share emotional experiences. All endpoints require authentication using your Slack ID and a secret key.

## Authentication
To use the API, you'll need:
- Your Slack ID (`userId`)
- Your secret key (`keyword`)

## Base URL
`http://api.blahaj.diy`

## Endpoints

### Account Management

#### Create Account
`POST /account`

Creates a new user account and returns your secret key.

**Curl Example:**```bash
curl -X POST http://api.blahaj.diy/account \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your_slack_id",
    "channel": "your_slack_channel"
  }'```

**Request Body:**
```json
{
    "userId": "your_slack_id",
    "channel": "your_slack_channel"
}
```

**Response:**
```json
{
    "data": {
        "key": "your_secret_key"
    }
}
```

#### Get Account Information
`GET /account?userId=your_slack_id&keyword=your_secret_key&category=optional_category`

Gets your account information, including total feelings and friends count.

**Curl Example:**```bash
curl "http://api.blahaj.diy/account?userId=your_slack_id&keyword=your_secret_key"
```

**Response:**
```json
{
    "data": {
        "slackId": "your_slack_id",
        "totalFeelings": 42,
        "friends": [],
        "feelingsByCategory": 12
    }
}
```

### Tracking Feelings

#### Record a New Feeling
`POST /feelings`

Records a new feeling entry.

**Curl Example:**
```bash
curl -X POST http://api.blahaj.diy/feelings \
  -H "Content-Type: application/json" \
  -d '{
    "feeling1": "happy",
    "feeling2": "excited",
    "note": "Had a great day!",
    "share": true,
    "userId": "your_slack_id",
    "keyword": "your_secret_key"
  }'```

**Request Body:**
```json
{
    "feeling1": "happy",
    "feeling2": "excited",  // optional
    "note": "Had a great day!",  // optional
    "share": true,  // optional, default false
    "userId": "your_slack_id",
    "keyword": "your_secret_key"
}
```

**Response:**
```json
{
    "data": {
        "category": "positive",
        "category2": "positive"
    }
}
```

### Retrieving Feelings

#### Get All Feelings
`GET /feelings/all/{userId}/{keyword}`

Returns all your recorded feelings.

**Curl Example:**
```bash
curl "http://api.blahaj.diy/feelings/all/your_slack_id/your_secret_key"
```

#### Get Recent Feelings
`GET /feelings/{userId}/{keyword}`

Returns your feelings with optional filters.

**Curl Example:**
```bash
curl "http://api.blahaj.diy/feelings/your_slack_id/your_secret_key?category=positive"
```

**Query Parameters:**
- Any feeling property (e.g., `?category=positive`)

#### Get Feelings by Date
`GET /feelings/date/{userId}/{keyword}?range={timeframe}`

Get feelings for a specific time period.

**Curl Example:**
```bash
curl "http://api.blahaj.diy/feelings/date/your_slack_id/your_secret_key?range=week"
```

**Time Ranges:**
- `today`
- `yesterday`
- `week`
- `month`

#### Get Latest Feeling
`GET /feelings/last/{userId}/{keyword}`

Returns your most recent feeling entry.

**Curl Example:**
```bash
curl "http://api.blahaj.diy/feelings/last/your_slack_id/your_secret_key"
```

### Friend Management

#### Add Friend
`POST /account/friends`

Add a new friend connection.

**Curl Example:**
```bash
curl -X POST http://api.blahaj.diy/account/friends \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your_slack_id",
    "friendId": "friend_slack_id",
    "key": "your_secret_key"
  }'
```

**Request Body:**
```json
{
    "userId": "your_slack_id",
    "friendId": "friend_slack_id",
    "key": "your_secret_key"
}
```

#### Get Friends List
`GET /account/friends/{userId}/{keyword}`

Returns list of your friends.

**Curl Example:**
```bash
curl "http://api.blahaj.diy/account/friends/your_slack_id/your_secret_key"
```

#### View Friends' Shared Feelings
`GET /feelings/friends/{userId}/{keyword}`

Returns feelings that your friends have shared.

**Curl Example:**
```bash
curl "http://api.blahaj.diy/feelings/friends/your_slack_id/your_secret_key"
```

### Update Account

#### Update Secret Key
`POST /account/information/update`

Update your authentication key.

**Curl Example:**
```bash
curl -X POST http://api.blahaj.diy/account/information/update \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your_slack_id",
    "key": "current_key",
    "random": true
  }'
```

**Request Body:**
```json
{
    "userId": "your_slack_id",
    "key": "current_key",
    "newKey": "new_key",  // optional
    "random": true  // optional, generates random key if true
}
```


Need help? Visit our [GitHub repository](https://github.com/radioblahaj/YouFeelWeFeel) for more information.



