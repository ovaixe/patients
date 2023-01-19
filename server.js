if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const patientRoutes = require('./routes/patients');
const db = require('./models');

const PORT = process.env.PORT || 500;
const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('CRUD API FOR PATIENT DETAILS.');
});

app.use('/patients', patientRoutes);


app.listen(PORT, async (err) => {
    if (err) console.log(`Error occured in listening on port ${PORT}`)
    else {
        console.log(`Server running on http://localhost:${PORT}`);
        await db.sequelize.sync();
        console.log('Database synced!...');
    }
});