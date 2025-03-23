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
app.post("/api/v1/campaigns", campaignController.createCampaign);
app.get("/api/v1/campaigns", campaignController.getAllCampaigns);
app.get("/api/v1/campaigns/:id", campaignController.getCampaignById);
app.put("/api/v1/campaigns/:id", campaignController.updateCampaign);
app.delete("/api/v1/campaigns/:id", campaignController.deleteCampaign);

app.post("/api/v1/events", eventController.trackEvent);
app.get("/api/v1/events", eventController.getAllEvents);
app.get("/api/v1/events/:id", eventController.getEventById);

// Fetch Campaign Metrics from Materialized View (No Fallback)
app.get("/api/v1/campaign-metrics", async (req, res) => {
    const { client_code, date_event } = req.query;

    if (!client_code) {
        return res.status(400).json({ error: "Client Code is required" });
    }

    let query = supabase
        .from("events_metrics_mv")
        .select("client_code, metric_name, metric_value, metric_type, chart, metric_category, sequence, date_event")
        .eq("client_code", client_code);

    if (date_event) query = query.eq("date_event", date_event);

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
});

// ============================== Server Startup ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
