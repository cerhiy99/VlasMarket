const { CountryMade } = require("../models/models");

class CountryMadeController{
    static AddCountryMade = async (req, resp, next) => {
        try {
          const { nameuk, nameru } = req.body;
          const res = await CountryMade.create({ nameuk, nameru });
          return resp.json({ res });
        } catch (err) {
          return next(ErrorApi.badRequest(err));
        }
    };
    static GetCountryMade = async (req, resp, next) => {
        try {
            const res = await CountryMade.findAll();
            return resp.json({ res });
        } catch (err) {
            return next(ErrorApi.badRequest(err));
        }
    };
}

module.exports=CountryMadeController;