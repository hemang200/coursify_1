import {model, Schema} from 'mongoose';

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide course title"],
        trim: true,
        maxlength: [100, "Course title should not exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please provide course description"],
       
        maxlength: [500, "Course description should not exceed 500 characters"],
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true,
        },
        secure_url: {   
            type: String,
            required: true,
        },
    },
    // instructor: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
    category: {
        type: String,
        required: [true, "Please provide course category"],
    },
    lectures: [
        {
            title: {
                type: String,
                required: [true, "Please provide lecture title"],
            },
            description: {
                type: String,
                required: [true, "Please provide lecture description"],
            },
            lecture:{
                public_id: {
                    type: String,
                    required: [true, "Please provide lecture video public ID"],
                },
            },
            secure_url: {
                type: String,
                required: [true, "Please provide lecture video URL"],
            },
        },
    ],
    numberOfLectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        
        required: true,
    },
    // price: {
    //     type: Number,
    //     required: [true, "Please provide course price"],
    // },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Course = model('Course', courseSchema);
export default Course;