const {Schema, model} = require('mongoose');

const HospitalSchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: {type: String},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'UserDTO',
        required: true
    },

});

HospitalSchema.method('toJSON', function(){
    const {__v, _id, ... object} = this.toObject();
    object.UUID = _id;
    return object
});

module.exports = model('HospitalDTO', HospitalSchema);