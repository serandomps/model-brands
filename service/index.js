var utils = require('utils');

var makes;
var makesById = {};
var modelsById = {};

var otherFix = function (entries) {
    var i;
    var length = entries.length;
    var other;
    for (i = 0; i < length; i++) {
        if (entries[i].title === 'Other') {
            other = entries.splice(i, 1)[0];
            break;
        }
    }
    entries.push(other);
    return entries;
}

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
        makes = otherFix(_.sortBy(m, 'title'));
        m.forEach(function (make) {
            makesById[make.id] = make;
            make.models = otherFix(_.sortBy(make.models, 'title'));
            var models = make.models;
            models.forEach(function (model) {
                modelsById[model.id] = model;
            });
        });
        done(null, makes);
    });
};
