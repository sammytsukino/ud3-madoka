const express = require('express');
const app = express();
const MagicalGirl = require('./models/MagicalGirl');
const Witch = require('./models/Witch');
const Familiar = require('./models/Familiar');
const {connectDB} = require('./db');

connectDB();

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => res.redirect('/index'));
app.get('/index', (req, res) => res.render('index', {title: 'Welcome'}));

app.get('/magicalgirls', async (req, res) => {
    const resultado = await MagicalGirl.find();
    res.send(resultado);
});

app.get('/magicalgirls/:id', async (req, res) => {
    const resultado = await MagicalGirl.findById(req.params.id);
    if (!resultado) return res.sendStatus(404);
    res.send(resultado);
});

app.post('/magicalgirls', async (req, res) => {
    const c = req.body;
    const existe = await MagicalGirl.findOne({name: c.name});
    if (existe) {
        return res.status(400).send('A magical girl with that name already exists');
    }
    try {
        const resultado = await MagicalGirl.create(c);
        res.status(201).send(resultado);
    } catch (err) {
        if (err.name === 'ValidationError') res.status(400).send(err.message);
        else throw err;
    }
});

app.put('/magicalgirls/:id', async (req, res) => {
    const c = req.body;
    const existe = await MagicalGirl.findOne({name: c.name, _id: {$ne: req.params.id}});
    if (existe) {
        return res.status(400).send('Another magical girl with that name already exists');
    }
    try {
        const resultado = await MagicalGirl.findByIdAndUpdate(req.params.id, {...req.body, $inc: {'__v': 1}}, {runValidators: true});
        if (!resultado) return res.sendStatus(404);
        res.sendStatus(204);
    } catch (err) {
        if (err.name === 'ValidationError') res.status(400).send(err.message);
        else throw err;
    }
});

app.delete('/magicalgirls/:id', async (req, res) => {
    const resultado = await MagicalGirl.findByIdAndDelete(req.params.id);
    if (!resultado) return res.sendStatus(404);
    res.sendStatus(204);
});

app.get('/witches', async (req, res) => {
    const resultado = await Witch.find().populate('magicalGirl');
    res.send(resultado);
});

app.get('/witches/:id', async (req, res) => {
    const resultado = await Witch.findById(req.params.id).populate('magicalGirl');
    if (!resultado) return res.sendStatus(404);
    res.send(resultado);
});

app.post('/witches', async (req, res) => {
    const c = req.body;
    const existe = await Witch.findOne({name: c.name});
    if (existe) {
        return res.status(400).send('A witch with that name already exists');
    }
    try {
        const resultado = await Witch.create(c);
        res.status(201).send(resultado);
    } catch (err) {
        if (err.name === 'ValidationError') res.status(400).send(err.message);
        else throw err;
    }
});

app.put('/witches/:id', async (req, res) => {
    const c = req.body;
    const existe = await Witch.findOne({name: c.name, _id: {$ne: req.params.id}});
    if (existe) {
        return res.status(400).send('Another witch with that name already exists');
    }
    try {
        const resultado = await Witch.findByIdAndUpdate(req.params.id, {...req.body, $inc: {'__v': 1}}, {runValidators: true});
        if (!resultado) return res.sendStatus(404);
        res.sendStatus(204);
    } catch (err) {
        if (err.name === 'ValidationError') res.status(400).send(err.message);
        else throw err;
    }
});

app.delete('/witches/:id', async (req, res) => {
    const resultado = await Witch.findByIdAndDelete(req.params.id);
    if (!resultado) return res.sendStatus(404);
    res.sendStatus(204);
});

app.get('/familiars', async (req, res) => {
    const resultado = await Familiar.find().populate('witch');
    res.send(resultado);
});

app.get('/familiars/:id', async (req, res) => {
    const resultado = await Familiar.findById(req.params.id).populate('witch');
    if (!resultado) return res.sendStatus(404);
    res.send(resultado);
});

app.post('/familiars', async (req, res) => {
    if (!req.body.witch || req.body.witch === '') {
        return res.status(400).send('witch id is required');
    }
    try {
        const resultado = await Familiar.create(req.body);
        res.status(201).send(resultado);
    } catch (err) {
        if (err.name === 'ValidationError') res.status(400).send(err.message);
        else throw err;
    }
});

app.put('/familiars/:id', async (req, res) => {
    try {
        const resultado = await Familiar.findByIdAndUpdate(req.params.id, {...req.body, $inc: {'__v': 1}}, {runValidators: true});
        if (!resultado) return res.sendStatus(404);
        res.sendStatus(204);
    } catch (err) {
        if (err.name === 'ValidationError') res.status(400).send(err.message);
        else throw err;
    }
});

app.delete('/familiars/:id', async (req, res) => {
    const resultado = await Familiar.findByIdAndDelete(req.params.id);
    if (!resultado) return res.sendStatus(404);
    res.sendStatus(204);
});

app.get('/list', async (req, res) => {
    const magicalgirls = await MagicalGirl.find();
    res.render('list', {magicalgirls, title: 'Magical Girls'});
});

app.get('/view/:id', async (req, res) => {
    const magicalgirl = await MagicalGirl.findById(req.params.id);
    if (!magicalgirl) return res.status(404).send('Magical girl not found');
    res.render('detail', {magicalgirl, title: magicalgirl.name});
});

app.post('/view/:id/delete', async (req, res) => {
    const resultado = await MagicalGirl.findByIdAndDelete(req.params.id);
    if (!resultado) return res.status(404).send('Magical girl not found');
    res.redirect('/list');
});

app.get('/edit/:id', async (req, res) => {
    const magicalgirl = await MagicalGirl.findById(req.params.id);
    if (!magicalgirl) return res.status(404).send('Magical girl not found');
    res.render('edit', {magicalgirl, title: 'Edit ' + magicalgirl.name});
});

app.post('/edit/:id', async (req, res) => {
    const c = {
        name: req.body.name,
        soulGemColor: req.body.soulGemColor,
        weapon: req.body.weapon,
        wish: req.body.wish || 'Not recorded',
        isWitch: req.body.isWitch === 'on',
        powerLevel: parseInt(req.body.powerLevel) || 10
    };
    try {
        const existe = await MagicalGirl.findOne({name: c.name, _id: {$ne: req.params.id}});
        if (existe) return res.status(400).send('Another magical girl with that name already exists');
        const resultado = await MagicalGirl.findByIdAndUpdate(req.params.id, c, {runValidators: true});
        if (!resultado) return res.status(404).send('Magical girl not found');
        res.redirect('/view/' + req.params.id);
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).send(err.message);
        throw err;
    }
});

app.get('/new', (req, res) => {
    res.render('new', {title: 'New magical girl'});
});

app.post('/process', async (req, res) => {
    const c = {
        name: req.body.name,
        soulGemColor: req.body.soulGemColor,
        weapon: req.body.weapon,
        wish: req.body.wish || 'Not recorded',
        isWitch: req.body.isWitch === 'on',
        powerLevel: parseInt(req.body.powerLevel) || 10
    };
    try {
        const existe = await MagicalGirl.findOne({name: c.name});
        if (existe) {
            return res.status(400).send('A magical girl with that name already exists');
        }
        await MagicalGirl.create(c);
        res.redirect('/list');
    } catch (err) {
        if (err.name === 'ValidationError') res.status(400).send(err.message);
        else throw err;
    }
});

app.get('/list-witches', async (req, res) => {
    const witches = await Witch.find().populate('magicalGirl');
    res.render('listWitches', {witches, title: 'Witches'});
});

app.get('/witch/:id', async (req, res) => {
    const witch = await Witch.findById(req.params.id).populate('magicalGirl');
    if (!witch) return res.status(404).send('Witch not found');
    res.render('detailWitch', {witch, title: witch.name});
});

app.get('/new-witch', async (req, res) => {
    const magicalgirls = await MagicalGirl.find();
    res.render('newWitch', {magicalgirls, title: 'New witch'});
});

app.post('/process-witch', async (req, res) => {
    const w = {
        name: req.body.name,
        barrierType: req.body.barrierType,
        dangerLevel: parseInt(req.body.dangerLevel) || 5,
        defeated: req.body.defeated === 'on',
        magicalGirl: req.body.magicalGirl || undefined,
        firstAppearance: req.body.firstAppearance ? new Date(req.body.firstAppearance) : undefined,
        lastSeen: req.body.lastSeen ? new Date(req.body.lastSeen) : undefined
    };
    try {
        const existe = await Witch.findOne({name: w.name});
        if (existe) return res.status(400).send('A witch with that name already exists');
        await Witch.create(w);
        res.redirect('/list-witches');
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).send(err.message);
        throw err;
    }
});

app.get('/edit-witch/:id', async (req, res) => {
    const [witch, magicalgirls] = await Promise.all([
        Witch.findById(req.params.id).populate('magicalGirl'),
        MagicalGirl.find()
    ]);
    if (!witch) return res.status(404).send('Witch not found');
    res.render('editWitch', {witch, magicalgirls, title: 'Edit ' + witch.name});
});

app.post('/edit-witch/:id', async (req, res) => {
    const w = {
        name: req.body.name,
        barrierType: req.body.barrierType,
        dangerLevel: parseInt(req.body.dangerLevel) || 5,
        defeated: req.body.defeated === 'on',
        magicalGirl: req.body.magicalGirl || undefined,
        firstAppearance: req.body.firstAppearance ? new Date(req.body.firstAppearance) : undefined,
        lastSeen: req.body.lastSeen ? new Date(req.body.lastSeen) : undefined
    };
    try {
        const existe = await Witch.findOne({name: w.name, _id: {$ne: req.params.id}});
        if (existe) return res.status(400).send('Another witch with that name already exists');
        const resultado = await Witch.findByIdAndUpdate(req.params.id, w, {runValidators: true});
        if (!resultado) return res.status(404).send('Witch not found');
        res.redirect('/witch/' + req.params.id);
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).send(err.message);
        throw err;
    }
});

app.post('/witch/:id/delete', async (req, res) => {
    const resultado = await Witch.findByIdAndDelete(req.params.id);
    if (!resultado) return res.status(404).send('Witch not found');
    res.redirect('/list-witches');
});

app.get('/list-familiars', async (req, res) => {
    const familiars = await Familiar.find().populate('witch');
    res.render('listFamiliars', {familiars, title: 'Familiars'});
});

app.get('/familiar/:id', async (req, res) => {
    const familiar = await Familiar.findById(req.params.id).populate('witch');
    if (!familiar) return res.status(404).send('Familiar not found');
    res.render('detailFamiliar', {familiar, title: familiar.name});
});

app.get('/new-familiar', async (req, res) => {
    const witches = await Witch.find();
    res.render('newFamiliar', {witches, title: 'New familiar'});
});

app.post('/process-familiar', async (req, res) => {
    if (!req.body.witch || req.body.witch === '') {
        return res.status(400).send('witch is required');
    }
    const f = {
        name: req.body.name,
        witch: req.body.witch,
        type: req.body.type,
        strength: parseInt(req.body.strength) || 5,
        isEvolved: req.body.isEvolved === 'on'
    };
    try {
        await Familiar.create(f);
        res.redirect('/list-familiars');
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).send(err.message);
        throw err;
    }
});

app.get('/edit-familiar/:id', async (req, res) => {
    const [familiar, witches] = await Promise.all([
        Familiar.findById(req.params.id).populate('witch'),
        Witch.find()
    ]);
    if (!familiar) return res.status(404).send('Familiar not found');
    res.render('editFamiliar', {familiar, witches, title: 'Edit ' + familiar.name});
});

app.post('/edit-familiar/:id', async (req, res) => {
    const f = {
        name: req.body.name,
        witch: req.body.witch,
        type: req.body.type,
        strength: parseInt(req.body.strength) || 5,
        isEvolved: req.body.isEvolved === 'on'
    };
    try {
        const resultado = await Familiar.findByIdAndUpdate(req.params.id, f, {runValidators: true});
        if (!resultado) return res.status(404).send('Familiar not found');
        res.redirect('/familiar/' + req.params.id);
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).send(err.message);
        throw err;
    }
});

app.post('/familiar/:id/delete', async (req, res) => {
    const resultado = await Familiar.findByIdAndDelete(req.params.id);
    if (!resultado) return res.status(404).send('Familiar not found');
    res.redirect('/list-familiars');
});

app.listen(8080, () => {
    console.log('Server started');
});
