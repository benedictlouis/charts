import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors'; 

dotenv.config(); 

const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors()); 

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: 5432,
  ssl: false,
});

// durations
app.get('/durations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        ROUND(
          EXTRACT(EPOCH FROM (
            (tanggal_selesai + jam_selesai::time) - (tanggal_awal + jam_awal::time)
          )) / 60, 
          2
        ) AS duration_minutes,
        pic
      FROM network_support
      WHERE 
        tanggal_awal IS NOT NULL AND jam_awal IS NOT NULL AND 
        tanggal_selesai IS NOT NULL AND jam_selesai IS NOT NULL;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching durations');
  }
});

// average durations
app.get('/average-durations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        EXTRACT(YEAR FROM tanggal_awal) AS year,
        EXTRACT(MONTH FROM tanggal_awal) AS month,
        EXTRACT(WEEK FROM tanggal_awal) AS week,
        ROUND(
          AVG(
            EXTRACT(EPOCH FROM (
              (tanggal_selesai + jam_selesai::time) - (tanggal_awal + jam_awal::time)
            )) / 60
          ), 
          2
        ) AS avg_duration_minutes
      FROM network_support
      WHERE 
        tanggal_awal IS NOT NULL AND jam_awal IS NOT NULL AND 
        tanggal_selesai IS NOT NULL AND jam_selesai IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM tanggal_awal), EXTRACT(MONTH FROM tanggal_awal), EXTRACT(WEEK FROM tanggal_awal)
      ORDER BY year, month, week;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching average durations');
  }
});

// job categories
app.get('/job-categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        kategori_pekerjaan,
        COUNT(*) AS total_jobs
      FROM network_support
      GROUP BY kategori_pekerjaan
      ORDER BY total_jobs DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching job categories');
  }
});


// jobs per pic
app.get('/jobs-per-pic', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        unnest(pic) AS pic_name,
        COUNT(*) AS total_jobs
      FROM network_support
      GROUP BY pic_name
      ORDER BY total_jobs DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching jobs per PIC');
  }
});

// job status distribution
app.get('/job-status-distribution', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        status_kerja,
        COUNT(*) AS total_jobs
      FROM network_support
      GROUP BY status_kerja
      ORDER BY total_jobs DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching job status distribution');
  }
});

// jobs/month
app.get('/jobs-per-month', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bulan,
        COUNT(*) AS total_jobs
      FROM network_support
      GROUP BY bulan
      ORDER BY bulan ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching jobs per month');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
