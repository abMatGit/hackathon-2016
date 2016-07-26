// access a property and throw if doesn't exist.
function access (resource, key) {
    var result = resource[key];

    if (!result) {
        var error = new ResourceAccessError(resource, key);
        console.error(error);
        throw error;
    }

    return result;
};


ResourceAccessError = function (key, value) {
    this.key = key;
    this.value = value;

    this.toString = function() {
        return this.value + " resource doesn't contain a value for key " + this.key;
    };
}

module.exports.access = access;
