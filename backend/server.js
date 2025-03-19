//backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================== Models ==============================
const Campaign = {
    async create(data) {
        return await supabase.from("campaigns").insert([data]);
    },
    async getAll() {
        return await supabase.from("campaigns").select("*");
    },
    async getById(id) {
        return await supabase.from("campaigns").select("*").eq("id", id).single();
    },
    async update(id, data) {
        return await supabase.from("campaigns").update(data).eq("id", id);
    },
    async delete(id) {
        return await supabase.from("campaigns").delete().eq("id", id);
    },
};

const Event = {
    async track(data) {
        return await supabase.from("events").insert([data]);
    },
    async getAll() {
        return await supabase.from("events").select("*");
    },
    async getById(id) {
        return await supabase.from("events").select("*").eq("id", id).single();
    },
};

// ============================== Controllers ==============================
const campaignController = {
    async createCampaign(req, res) {
        const { name, description, startDate, endDate } = req.body;
        const { error } = await Campaign.create({ name, description, startDate, endDate });
        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ message: "Campaign created successfully" });
    },
    async getAllCampaigns(req, res) {
        const { data, error } = await Campaign.getAll();
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    },
    async getCampaignById(req, res) {
        const { data, error } = await Campaign.getById(req.params.id.trim());
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    },
    async updateCampaign(req, res) {
        const { error } = await Campaign.update(req.params.id, req.body);
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: "Campaign updated successfully" });
    },
    async deleteCampaign(req, res) {
        const { error } = await Campaign.delete(req.params.id);
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: "Campaign deleted successfully" });
    },
};

const eventController = {
    async trackEvent(req, res) {
        const { type, campaignId, userId } = req.body;
        const { error } = await Event.track({ type, campaignId, userId });
        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ message: "Event tracked successfully" });
    },
    async getAllEvents(req, res) {
        const { data, error } = await Event.getAll();
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    },
    async getEventById(req, res) {
        const { data, error } = await Event.getById(req.params.id.trim());
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    },
};

// ============================== Routes ==============================
app.post("/api/campaigns", campaignController.createCampaign);
app.get("/api/campaigns", campaignController.getAllCampaigns);
app.get("/api/campaigns/:id", campaignController.getCampaignById);
app.put("/api/campaigns/:id", campaignController.updateCampaign);
app.delete("/api/campaigns/:id", campaignController.deleteCampaign);

app.post("/api/events", eventController.trackEvent);
app.get("/api/events", eventController.getAllEvents);
app.get("/api/events/:id", eventController.getEventById);

// Fetch Campaign Metrics from Materialized View (with Fallback)
app.get("/api/campaign-metrics", async (req, res) => {
    const { client_code } = req.query;
    if (!client_code) return res.status(400).json({ error: "Client Code is required" });

    let { data, error } = await supabase.from("events_metrics_mv").select("*").eq("client_code", client_code);
    
    if (error || !data.length) {
        console.warn("Falling back to events_metrics table");
        ({ data, error } = await supabase.from("events_metrics").select("*").eq("client_code", client_code));
    }

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ============================== Server Startup ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
