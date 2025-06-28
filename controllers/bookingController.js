const Booking = require('../models/Booking');
const Catway = require('../models/Catway');

exports.getAllBookings = async (req, res) => {
    try {
        const id = req.params.id;
        const catway = await Catway.findById(id);
        if(!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const bookings = await Booking.find({catwayNumber : catway.catwayNumber});

        res.render('bookingsList', {
            title : `Réservations du catway ${catway.catwayNumber}`,
            booking : bookings,
            catway : catway
        });
    } catch(error) {
        res.status(500).json({message: 'Erreur serveur', error: error.message})
    };
};

exports.getBookingById = async (req, res) => {
    try {
        const id = req.params.id;
        const idReservation = req.params.idReservation;
        const catway = await Catway.findById(id)

        if(!catway) {
           return res.status(404).json({message : 'Catway non trouvé'});
        } else{
            const booking = await Booking.findById(idReservation)
                if(booking) {
                    return res.render('bookingById', { title: `Détail de la réservation de ${booking.clientName} - catway n°${catway.catwayNumber}`, booking, catway});
                }
            return res.status(404).json({ message : 'Aucune réservation trouvé'});
        }
          
    } catch(error) {
        return res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const id = req.params.id;

        const catway = await Catway.findById(id);
        if(!catway) {
            return res.status(404).json({ message : 'Catway non trouvé'});
        }

        const bookingData = {
            bookingId: req.body.bookingId,
            catwayNumber: catway.catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
        };

        const newBooking = await Booking.create(bookingData);

        res.status(201).json(newBooking);
    } catch(error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const idReservation = req.params.idReservation;
        const catway = await Catway.findById(id);

        if(!catway) {
            return res.status(404).json({ message : 'Catway non trouvé'})
        }

        const updatedData = {
            clientName : req.body.clientName,
            boatName : req.body.boatName,
            checkIn : req.body.checkIn,
            checkOut : req.body.checkOut
        };
        
        const booking = await Booking.findOneAndUpdate(
             { _id: idReservation, catwayNumber : catway.catwayNumber }, 
            updatedData,
            { new: true, runValidators: true } 
        );

        if(!booking) {
            return res.status(404).json({ message : 'Réservation non trouvée'})
        }

        res.status(200).json({ message : 'Réservation mise à jour', booking});
    } catch(error) {
        return res.status(500).json({ message : 'Erreur serveur', error : error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    
    const id = req.params.id;
    let catway = await Catway.findById(id);

    if (catway) {
        const idReservation = req.params.idReservation;

        try {
            await Booking.deleteOne({ _id: idReservation, catwayNumber : catway.catwayNumber });
    
            return res.status(200).json({ message : 'Réservation supprimée'});
        } catch (error) {
            return res.status(500).json({ message : 'Erreur serveur', error : error.message })
        }
    }
};
