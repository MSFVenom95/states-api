const State = require('../models/State');
const statesData = require('../models/statesData.json');

// GET /states/
const getAllStates = async (req, res) => {
    try {
        let statesList = [...statesData];

        if (req.query.contig === 'true') {
            statesList = statesList.filter(st => st.code !== 'AK' && st.code !== 'HI');
        } else if (req.query.contig === 'false') {
            statesList = statesList.filter(st => st.code === 'AK' || st.code === 'HI');
        }

        const mongoStates = await State.find().exec();

        const mergedStates = statesList.map(state => {
            const stateFacts = mongoStates.find(ms => ms.stateCode === state.code);
            
            // Create a fresh copy of the JSON state
            let stateObj = { ...state };
            
            // Strictly check if funfacts exist AND has items inside it
            if (stateFacts && stateFacts.funfacts && stateFacts.funfacts.length > 0) {
                stateObj.funfacts = [...stateFacts.funfacts];
            } else {
                // If it's completely empty, ensure the property is destroyed
                stateObj.funfacts = [];
            }
            
            return stateObj;
        });

        res.json(mergedStates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

// GET /states/:state
const getState = async (req, res) => {
    try {
        const state = statesData.find(st => st.code === req.code);
        const stateFacts = await State.findOne({ stateCode: req.code }).exec();

        let stateObj = { ...state };

        if (stateFacts && stateFacts.funfacts && stateFacts.funfacts.length > 0) {
            stateObj.funfacts = [...stateFacts.funfacts];
        } else {
            delete stateObj.funfacts;
        }

        res.json(stateObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

// GET /states/:state/funfact
const getStateFunFact = async (req, res) => {
    try {
        const stateFacts = await State.findOne({ stateCode: req.code }).exec();
        const jsonState = statesData.find(st => st.code === req.code);

        if (!stateFacts || !stateFacts.funfacts || stateFacts.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${jsonState.state}` });
        }

        const randomIndex = Math.floor(Math.random() * stateFacts.funfacts.length);
        res.json({ funfact: stateFacts.funfacts[randomIndex] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

// GET /states/:state/capital
const getStateCapital = (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    res.json({ state: state.state, capital: state.capital_city });
}

// GET /states/:state/nickname
const getStateNickname = (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    res.json({ state: state.state, nickname: state.nickname });
}

// GET /states/:state/population
const getStatePopulation = (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    res.json({ state: state.state, population: state.population.toLocaleString('en-US') });
}

// GET /states/:state/admission
const getStateAdmission = (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    res.json({ state: state.state, admitted: state.admission_date });
}

// POST /states/:state/funfact
const createStateFunFact = async (req, res) => {
    if (!req.body || !req.body.funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }

    try {
        let stateFacts = await State.findOne({ stateCode: req.code }).exec();

        if (!stateFacts) {
            stateFacts = await State.create({
                stateCode: req.code,
                funfacts: req.body.funfacts
            });
        } else {
            stateFacts.funfacts.push(...req.body.funfacts);
            await stateFacts.save();
        }

        res.status(201).json(stateFacts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

// PATCH /states/:state/funfact
const updateStateFunFact = async (req, res) => {
    if (!req.body?.index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!req.body?.funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    try {
        const stateFacts = await State.findOne({ stateCode: req.code }).exec();
        const jsonState = statesData.find(st => st.code === req.code);

        if (!stateFacts || !stateFacts.funfacts || stateFacts.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${jsonState.state}` });
        }

        const adjustedIndex = req.body.index - 1;

        if (adjustedIndex < 0 || adjustedIndex >= stateFacts.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${jsonState.state}` });
        }

        const result = await State.findOneAndUpdate(
            { stateCode: req.code },
            { $set: { [`funfacts.${adjustedIndex}`]: req.body.funfact } },
            { new: true }
        );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

// DELETE /states/:state/funfact
const deleteStateFunFact = async (req, res) => {
    if (!req.body?.index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    try {
        const stateFacts = await State.findOne({ stateCode: req.code }).exec();
        const jsonState = statesData.find(st => st.code === req.code);

        if (!stateFacts || !stateFacts.funfacts || stateFacts.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${jsonState.state}` });
        }

        const adjustedIndex = req.body.index - 1;

        if (adjustedIndex < 0 || adjustedIndex >= stateFacts.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${jsonState.state}` });
        }

        stateFacts.funfacts = stateFacts.funfacts.filter((fact, index) => index !== adjustedIndex);
        const result = await stateFacts.save();

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    getAllStates,
    getState,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
    getStateFunFact,
    createStateFunFact,
    updateStateFunFact,
    deleteStateFunFact
}