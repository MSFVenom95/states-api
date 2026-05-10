const statesData = require('../models/statesData.json');

const verifyStates = (req, res, next) => {
    if (!req.params.state) return res.status(400).json({ message: 'State abbreviation required' });
    
    // Force the parameter to uppercase BEFORE checking it
    const stateCode = req.params.state.toUpperCase();
    const stateCodes = statesData.map(st => st.code);
    
    if (!stateCodes.includes(stateCode)) {
        return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }
    
    req.code = stateCode; // Pass the safe, uppercased code to the controllers
    next();
}

module.exports = verifyStates;