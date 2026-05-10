const statesData = require('../models/statesData.json');

const verifyStates = (req, res, next) => {
    const validStateCodes = statesData.map(state => state.code);

    // Check if a state parameter was passed in the URL
    if (!req.params.state) {
        return res.status(400).json({ message: 'State abbreviation required.'});
    }

    // Convert the parameter to uppercase to handle mixed case inputs
    const stateAbbr = req.params.state.toUpperCase();

    // Verify if the submitted abbreviation exists in our array
    if (!validStateCodes.includes(stateAbbr)) {
        // If it isn't in the array, return a 404
        return res.status(404).json({ message: 'Invalid state abbreviation parameter'});
    }

    // If valid, attach the uppercase code to the request object and move on
    req.code = stateAbbr;
    next();
};

module.exports = verifyStates;