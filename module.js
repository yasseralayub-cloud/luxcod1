module.exports = function createAppModule(APP_ID) {
  const express = require('express');
  const { PrismaClient } = require('@prisma/client');
  const app = express();
  const prisma = new PrismaClient();

  const IS_EMBEDDED = global.PARENT_SERVER_MODE || process.env.EMBEDDED_MODE;
  const API_BASE = IS_EMBEDDED ? `/api/${APP_ID}` : '';

  app.use(express.json());

  app.get(`${API_BASE}/business-info`, async (req, res) => {
    try {
      const data = await prisma.businessInfo.findFirst();
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get(`${API_BASE}/projects`, async (req, res) => {
    try {
      const data = await prisma.project.findMany({
        orderBy: { order: 'asc' }
      });
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get(`${API_BASE}/testimonials`, async (req, res) => {
    try {
      const data = await prisma.testimonial.findMany({
        orderBy: { order: 'asc' }
      });
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get(`${API_BASE}/services`, async (req, res) => {
    try {
      const data = await prisma.service.findMany({
        orderBy: { order: 'asc' }
      });
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post(`${API_BASE}/contact`, async (req, res) => {
    try {
      const { name, phone, message } = req.body;
      if (!name || !phone || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
      }
      const data = await prisma.contactSubmission.create({
        data: { name, phone, message }
      });
      res.json({ success: true, data });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });

  return app;
};