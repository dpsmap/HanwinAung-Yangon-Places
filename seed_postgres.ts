import pg from 'pg';
import { DEFAULT_PLACES } from './src/data.ts';

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.error('❌ DATABASE_URL is not set. Set it in your shell or deployment environment before running the seed script.');
  process.exit(1);
}

const tableName = 'Thingangyun';

async function seed() {
  console.log('🌱 Starting PostgreSQL database seeding via Node.js...');
  console.log(`Connecting to database...`);
  
  const pool = new pg.Pool({
    connectionString,
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    // 1. Drop existing table if any
    console.log(`Cleaning old tables for "${tableName}"...`);
    await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);

    // 2. Create the table
    console.log(`Creating "${tableName}" table schema...`);
    const createTableSql = `
      CREATE TABLE ${tableName} (
        place_id VARCHAR(100) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_my VARCHAR(255),
        category VARCHAR(100),
        category_my VARCHAR(100),
        house_number VARCHAR(100),
        house_number_my VARCHAR(100),
        full_address TEXT,
        full_address_my TEXT,
        township VARCHAR(100),
        township_my VARCHAR(100),
        district VARCHAR(100),
        district_my VARCHAR(100),
        sub_region VARCHAR(100),
        sub_region_my VARCHAR(100),
        postal_code VARCHAR(100),
        lat DOUBLE PRECISION,
        lon DOUBLE PRECISION,
        embed_text TEXT,
        phone VARCHAR(100),
        rating DECIMAL(3,2),
        review_count INT,
        website TEXT,
        city VARCHAR(100)
      );
    `;
    await client.query(createTableSql);
    console.log(`✅ "${tableName}" table created successfully.`);

    // 3. Seed places in batch using optimized multi-row insertions
    const BATCH_SIZE = 200;
    console.log(`Seeding ${DEFAULT_PLACES.length} records into PostgreSQL table "${tableName}" using optimized batching...`);

    for (let i = 0; i < DEFAULT_PLACES.length; i += BATCH_SIZE) {
      const batch = DEFAULT_PLACES.slice(i, i + BATCH_SIZE);
      const valueParams = [];
      const flatValues = [];
      let paramIdx = 1;

      for (const p of batch) {
        const rowParams = [];
        const cols = [
          p.place_id,
          p.name,
          p.name_my || '',
          p.category || '',
          p.category_my || '',
          p.house_number || '',
          p.house_number_my || '',
          p.full_address || '',
          p.full_address_my || '',
          p.township || 'Other',
          p.township_my || '',
          p.district || '',
          p.district_my || '',
          p.sub_region || '',
          p.sub_region_my || '',
          p.postal_code || '',
          p.lat || 16.8,
          p.lon || 96.15,
          p.embed_text || '',
          p.phone || '',
          p.rating || 4.5,
          p.review_count || 10,
          p.website || '',
          p.city || 'Yangon'
        ];

        cols.forEach(val => {
          rowParams.push(`$${paramIdx++}`);
          flatValues.push(val);
        });

        valueParams.push(`(${rowParams.join(', ')})`);
      }

      const batchInsertSql = `
        INSERT INTO ${tableName} (
          place_id, name, name_my, category, category_my, house_number, house_number_my,
          full_address, full_address_my, township, township_my, district, district_my,
          sub_region, sub_region_my, postal_code, lat, lon, embed_text, phone, rating,
          review_count, website, city
        ) VALUES ${valueParams.join(', ')};
      `;

      await client.query(batchInsertSql, flatValues);
      console.log(`  Inserted batch: rows ${i + 1} to ${Math.min(i + BATCH_SIZE, DEFAULT_PLACES.length)}`);
    }
    console.log('✅ All travel landmarks successfully inserted.');
    
    console.log('🎉 Database seeding completed successfully! All travel landmarks are active.');
    client.release();
  } catch (err: any) {
    console.error('❌ Database seeding failed:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
