var utils = require('utils');

var brands = {};
var brandsById = {};
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

exports.findModel = function (model, id, done) {
    exports.find(model, function (err) {
        if (err) {
            return done(err);
        }
        done(null, modelsById[id]);
    });
};

exports.findModels = function (model, id, done) {
    exports.findOne(model, id, function (err, brand) {
        if (err) {
            return done(err);
        }
        done(null, brand.models);
    });
};

exports.findOne = function (model, id, done) {
    exports.find(model, function (err) {
        if (err) {
            return done(err);
        }
        done(null, brandsById[id]);
    });
};

exports.find = function (model, done) {
    if (brands[model]) {
        return done(null, brands[model]);
    }
    utils.configs('brands-' + model, function (err, brandz) {
        if (err) {
            return done(err);
        }
        brandz.forEach(function (brand) {
            brandsById[brand.id] = brand;
            brand.models = otherFix(_.sortBy(brand.models, 'title'));
            var models = brand.models;
            models.forEach(function (model) {
                modelsById[model.id] = model;
            });
        });
        brands[model] = otherFix(_.sortBy(brandz, 'title'));
        done(null, brands[model]);
    });
};
