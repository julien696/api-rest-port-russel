const Catway = require('../models/Catway');

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();

        if(catways) {
            res.render('catways', {
                title : 'Catway',
                catways : catways
            });
        }
    } catch(error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message});
    }
};

exports.createCatway = async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const newCatway = new Catway({ catwayNumber, type, catwayState });
        await newCatway.save();
        res.status(201).json(newCatway);
    } catch(error) {
        res.status(400).json({ message: 'Erreur lors de la création', error: message.error});
    }
};

exports.updateCatway = async (req, res) => {
    try {
        const updatedCatway = await Catway.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );
        if(!updatedCatway) return res.status(404).json({ message:'Catway bnon trouvé'});
        res.status(200).json(updatedCatway);
    } catch(error) {
        res.status(400).json({message: 'Erreur mise à jour', error: error.message});
    }  
};

exports.partialUpdateCatway = async (req, res) => {
    try {
        const updateCatway = await Catway.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true}
        );
        if(!updateCatway) return res.status(404).json({ message: 'Catway non trouvé'});
        res.status(200).json(updateCatway);
    } catch(error) {
        res.status(400).json({message: 'Erreur patch', error: error.message});
    }
};

exports.getCatwayById = async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if(!catway) return res.status(404).json({ message: 'Catway non trouvé'});
        res.status(200).json(catway)
    } catch(error) {
        res.satus(500).json({ message: 'Erreur serveur', error: error.message});
    }
};

exports.deleteCatway = async (req,res) => {
    try {
        const deleteCatway = await Catway.findByIdAndDelete(req.params.id);
        if(!deleteCatway) return res.status(404).json({message: 'Catway non trouvé'});
        res.status(200).json({message: 'Ctaway supprimé'})
    } catch(error) {
        res.status(500).json({message: 'Erreur Serveur', error: error.message});
    }
}