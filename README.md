# Attendance System

## What is this?
Dexa Full Stack Test.

## Tech stacks

The project is using these tech stacks : 
- Language : Javascript
- Framework : Node.js Express.js
- Database : Mysql
- Token : JWT
- Cron: Used for automating attendance clearing every 24 hours
- Cloud Storage: Google Cloud Storage (for storing images)

## How to run this project

- Please make sure you have npm installed locally. If you don't have it yet, download it via [download npm](https://nodejs.org/en/download)
- Make sure you have your mysql database credentials and jwtsecret in .env.
- Make sure you have your Google Cloud Console Account Key.
- Make sure to install all node_modules
- After everything is done execute this in your console ```$ npm start```
- DB Table will automatically created based on the models.
- For starter since there are no users yet, create 1 admin manually in DB, then you could run the project, log in as admin, and create a new employee.
