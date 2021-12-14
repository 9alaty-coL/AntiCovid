class PatientController {
    home(req, res, next) {
        res.render('patient/home');
    }
}

module.exports = new PatientController();
