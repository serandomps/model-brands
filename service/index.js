var utils = require('utils');
var serand = require('serand');

var makes;

var findOne = function (id, makes) {
    var i;
    var make;
    var length = makes.length;
    for (i = 0; i < length; i++) {
        make = makes[i];
        if (make.id === id) {
            break;
        }
    }
    return make;
};

exports.findOne = function (id, done) {
    if (makes) {
        return done(null, findOne(id, makes));
    }
    exports.find(function (err, makes) {
        if (err) {
            return done(err);
        }
        done(null, findOne(id, makes));
    });
};

module.exports.find = function (done) {
    if (makes) {
        return done(null, makes);
    }
    utils.sync('vehicle-makes:find', function (ran) {
        var next = utils.resolve('autos:///apis/v/vehicle-makes' + utils.data({
            count: 100
        }));
        utils.all(next, function (err, o) {
            if (err) {
                return ran(err);
            }
            makes = _.sortBy(o, 'title');
            ran(null, makes);
        });
    }, done);
};
