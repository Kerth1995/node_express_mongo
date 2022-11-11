const {Schema, model} = require('mongoose');

const DoctorSchema = Schema({
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
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'HospitalDTO',
        required: true
    },
});

DoctorSchema.method('toJSON', function(){
    const {__v, _id, ... object} = this.toObject();
    object.UUID = _id;
    return object
});

module.exports = model('DoctorDTO', DoctorSchema);