import express from 'express';
import cors from 'cors';
import audit from 'express-requests-logger';
import schemaBuilder from '@ideditor/schema-builder';
import fs from 'fs';

const app = express();

app.use(cors({
    origin: '*',
}));
app.use(audit());
app.use(express.json())

const port = 3000;

app.use(express.static('.'));

function runDist() {
    let translationOptions = {};
    if (process.argv.includes('translations')) {
        translationOptions = {
            translOrgId: 'openstreetmap',
            translProjectId: 'id-editor',
            translResourceIds: ['presets'],
            translReviewedOnly: ['vi']
        };
    }

    schemaBuilder.buildDist({
        taginfoProjectInfo: {
          name: 'iD Tagging Schema',
          description: 'Presets available in the iD editor, Rapid, StreetComplete, Go Map!!, Every Door, and other applications',
          project_url: 'https://github.com/openstreetmap/id-tagging-schema/',
          icon_url: 'https://cdn.jsdelivr.net/gh/openstreetmap/iD@release/dist/img/logo.png',
          contact_name: 'Martin Raifer',
          contact_email: 'martin@raifer.tech'
        },
        ...translationOptions
    });
}

app.post('/add', (req, res) => {
    const name = req.body.name;
    const icon = req.body.icon;
    const obj = {
        icon: icon,
        tags: {
            custom: name 
        },
        geometry: [
            "point",
            "area"
        ],
        name: name
    };
    try {
        if (!fs.existsSync('data/presets/custom/' + name + '.json')) {
            fs.writeFile('data/presets/custom/' + name + '.json', JSON.stringify(obj), function (err) {
                if (err) throw err;
                console.log('Saved!');
                runDist()
            });
        }
    }
    catch (err) {
        console.log('.')
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});