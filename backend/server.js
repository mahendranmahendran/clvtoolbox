
// Handles campaigns (CRUD operations)
// Uploads event data to AWS S3
// Uses Supabase as the database
// Implements API key-based authentication
// Uses middleware for error handling
// Provides clear comments for future refactoring

// File: backend/server.js

// 1. Load Environment Variables (from .env)
// 2. Import Dependencies (Express, Middleware, etc.)
// 3. Initialize Express App
// 4. Apply Middleware (CORS, JSON Parsing, API Key Authentication)
// 5. Define Routes (Campaigns, Events, Analytics, etc.)
// 6. Error Handling Middleware
// 7. Start the Express Server


// File: backend/server.js
// Description: This file contains the entire backend logic including models, routes, controllers, and services for campaigns, events, and analytics.
// List of variables in this file and their purpose:
// - supabaseUrl: The URL of the Supabase project
// - supabaseKey: The API key of the Supabase project
// - supabase: The Supabase client created using the URL and API key
// - Campaign: The model for interacting with the campaigns table in the database
// - Event: The model for interacting with the events table in the database
// - campaignController: The controller for handling campaign-related requests
// - eventController: The controller for handling event-related requests
// - campaignService: The service for analyzing campaign performance
// - app: The Express application
// - PORT: The port on which the server will run
// - express: The Express library
// - cors: The CORS library
// - createClient: The function to create a Supabase client
// - dotenv: The library to load environment variables from a .env file

//List of functions in this file and their purpose:
// - Campaign.create: Creates a new campaign in the database
// - Campaign.getAll: Gets all campaigns from the database
// - Campaign.getById: Gets a campaign by its ID from the database
// - Campaign.update: Updates a campaign in the database
// - Campaign.delete: Deletes a campaign from the database
// - Event.track: Tracks an event in the database
// - Event.getAll: Gets all events from the database
// - Event.getById: Gets an event by its ID from the database
// - campaignController.createCampaign: Creates a new campaign
// - campaignController.getAllCampaigns: Gets all campaigns
// - campaignController.getCampaignById: Gets a campaign by its ID
// - campaignController.updateCampaign: Updates a campaign
// - campaignController.deleteCampaign: Deletes a campaign
// - eventController.trackEvent: Tracks an event
// - eventController.getAllEvents: Gets all events
// - eventController.getEventById: Gets an event by its ID
// - campaignService.analyzeCampaignPerformance: Analyzes the performance of a campaign
// - app.post: Defines a POST route
// - app.get: Defines a GET route
// - app.put: Defines a PUT route
// - app.delete: Defines a DELETE route

//List of routes in this file and their purpose:
// - POST /api/campaigns: Creates a new campaign
// - GET /api/campaigns: Gets all campaigns
// - GET /api/campaigns/:id: Gets a campaign by its ID
// - PUT /api/campaigns/:id: Updates a campaign
// - DELETE /api/campaigns/:id: Deletes a campaign

//List of middleware in this file and their purpose:
// - express.json: Parses incoming request bodies in JSON format
// - cors: Enables Cross-Origin Resource Sharing (CORS)
// - app.use: Uses middleware in the Express application

//List of error handling in this file and their purpose:
// - Returns an error response if there is an error in the database operation
// - Returns a success response if the operation is successful
// - Returns a message indicating the success or failure of the operation

//Flowchart of the server.js file:
// 1. Load environment variables
// 2. Import dependencies
// 3. Initialize the Express app
// 4. Apply middleware
// 5. Define routes
// 6. Start the Express server




require("dotenv").config();//loads environment variables from a .env file   
const express = require("express");//imports the express library 
const cors = require("cors");//imports the cors library
const { createClient } = require("@supabase/supabase-js");//imports the createClient function from the supabase library

const app = express();//
app.use(express.json());
app.use(cors());

// Database Connection
// Future Location: backend/config/db.js
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================== Models ==============================
// Future Location: backend/models/campaignModel.js
//What this does: This model contains functions to interact with the campaigns table in the database.
const Campaign = {
    async create(data) { 
        return await supabase.from("campaigns").insert([data]);//inserts the provided data into the campaigns table 
    },
    async getAll() {
        return await supabase.from("campaigns").select("*");//selects all columns from the campaigns table  
    },
    async getById(id) {
        return await supabase.from("campaigns").select("*").eq("id", id).single();//selects all columns from the campaigns table where the id is equal to the provided id
    },
    async update(id, data) {
        return await supabase.from("campaigns").update(data).eq("id", id);//updates the campaign with the provided id with the new data
    },
    async delete(id) {
        return await supabase.from("campaigns").delete().eq("id", id); //Deletes the campaign with the provided id
    },
};

// Future Location: backend/models/eventModel.js
const Event = {
    async track(data) {
        return await supabase.from("events").insert([data]);//inserts the provided data into the events table
    },
    async getAll() {
        return await supabase.from("events").select("*");//selects all columns from the events table
    },
    async getById(id) {
        return await supabase.from("events").select("*").eq("id", id).single();//selects all columns from the events table where the id is equal to the provided id
    },
};

// ============================== Controllers ==============================
// Future Location: backend/controllers/campaignController.js
const campaignController = {
    async createCampaign(req, res) {
        const { name, description, startDate, endDate } = req.body;//extracts the name, description, startDate, and endDate from the request body
        const { error } = await Campaign.create({ name, description, startDate, endDate });//creates a new campaign with the extracted data
        if (error) return res.status(400).json({ error: error.message });//RETURNS AN ERROR IF THERE IS AN ERROR
        res.status(201).json({ message: "Campaign created successfully" });//RETURNS A SUCCESS MESSAGE IF THE CAMPAIGN IS CREATED SUCCESSFULLY  
    },
    async getAllCampaigns(req, res) {
        const { data, error } = await Campaign.getAll();//gets all campaigns from the database  
        if (error) return res.status(400).json({ error: error.message });//RETURNS AN ERROR IF THERE IS AN ERROR
        res.json(data);//RETURNS THE DATA
    },
    async getCampaignById(req, res) {//gets a campaign by its id
        const { data, error } = await Campaign.getById(req.params.id.trim());//gets the campaign with the provided id
        if (error) return res.status(400).json({ error: error.message });//returns an error if there is an error
        res.json(data);//returns the data   
    },
    async updateCampaign(req, res) {
        const { error } = await Campaign.update(req.params.id, req.body);//updates the campaign with the provided id with the new data
        if (error) return res.status(400).json({ error: error.message });//returns an error if there is an error
        res.json({ message: "Campaign updated successfully" });//returns a success message if the campaign is updated successfully
    },
    async deleteCampaign(req, res) {
        const { error } = await Campaign.delete(req.params.id);//deletes the campaign with the provided id
        if (error) return res.status(400).json({ error: error.message });//returns an error if there is an error
        res.json({ message: "Campaign deleted successfully" });//returns a success message if the campaign is deleted successfully
    },
};



// Future Location: backend/controllers/eventController.js
const eventController = {
    async trackEvent(req, res) {//tracks an event
        const { type, campaignId, userId } = req.body;//extracts the type, campaignId, and userId from the request body
        const { error } = await Event.track({ type, campaignId, userId });//tracks the event with the extracted data
        if (error) return res.status(400).json({ error: error.message });//returns an error if there is an error
        res.status(201).json({ message: "Event tracked successfully" });//returns a success message if the event is tracked successfully    
    },
    async getAllEvents(req, res) {//gets all events
        const { data, error } = await Event.getAll();//gets all events from the database
        if (error) return res.status(400).json({ error: error.message });//returns an error if there is an error
        res.json(data);//returns the data
    },
    async getEventById(req, res) {//gets an event by its id
        const { data, error } = await Event.getById(req.params.id.trim());//gets the event with the provided id
        if (error) return res.status(400).json({ error: error.message });//returns an error if there is an error
        res.json(data);//returns the data
    },
};

// ============================== Services ==============================
// Future Location: backend/services/campaignService.js
const campaignService = {//contains functions to interact with the campaign data
    async analyzeCampaignPerformance(campaignId) {//analyzes the performance of a campaign
        const { data, error } = await supabase//gets all events related to the provided campaignId  
            .from("events")//from the events table
            .select("*")//selects all columns
            .eq("campaignId", campaignId);//where the campaignId is equal to the provided campaignId    
        if (error) return { error: error.message };//returns an error if there is an error 
        return { data };
    },
};

// ============================== Routes ==============================
// Future Location: backend/routes/campaignRoutes.js
app.post("/api/campaigns", campaignController.createCampaign);
app.get("/api/campaigns", campaignController.getAllCampaigns);
app.get("/api/campaigns/:id", campaignController.getCampaignById);
app.put("/api/campaigns/:id", campaignController.updateCampaign);
app.delete("/api/campaigns/:id", campaignController.deleteCampaign);

// Future Location: backend/routes/eventRoutes.js
app.post("/api/events", eventController.trackEvent);
app.get("/api/events", eventController.getAllEvents);
app.get("/api/events/:id", eventController.getEventById);

// ============================== Server Startup ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
