import express from 'express';
import cors from 'cors';
import audit from 'express-requests-logger';
import schemaBuilder from '@ideditor/schema-builder';
import fs from 'fs';

const app = express();

app.use(cors({
    origin: '*',
}));
// app.use(audit());
app.use(express.json())

const port = 4000;

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


function saveIcon(filePath, data) {
    console.log(filePath)
    console.log(data)
    if (data !== null && !fs.existsSync('icons/' + filePath )) {
        fs.appendFile('icons/' + filePath, data, ()=>{});
    }
    return 'https://maps.megafete.ru/icons/' + filePath;
}

app.get('/info', (req, res) => {
    const files = fs.readdirSync('./icons/');
    res.json(files);
});

app.post('/add', (req, res) => {
    const name = req.body.name;
    const fileName = req.body.fileName; 
    const body = req.body.data;
    console.log(fileName);
    const obj = {
        imageURL: saveIcon(fileName, body),
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