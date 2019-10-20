var utils = require('utils');

var makes;
var makesById = {};
var modelsById = {};

exports.findModel = function (id, done) {
    exports.find(function (err) {
        if (err) {
            return done(err);
        }
        done(null, modelsById[id]);
    });
};

exports.findModels = function (id, done) {
    exports.findOne(id, function (err, make) {
        if (err) {
            return done(err);
        }
        done(null, make.models);
    });
};

exports.findOne = function (id, done) {
    exports.find(function (err) {
        if (err) {
            return done(err);
        }
        done(null, makesById[id]);
    });
};

exports.find = function (done) {
    if (makes) {
        return done(null, makes);
    }
    utils.configs('vehicle-makes', function (err, m) {
        if (err) {
            return done(err);
        }
        makes = m;
        m.forEach(function (make) {
            makesById[make.id] = make;
            var models = make.models;
            models.forEach(function (model) {
                modelsById[model.id] = model;
            });
        });
        done(null, makes);
    });
};
