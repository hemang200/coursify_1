import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const getAllCourses = async function (req, res, next) {
    try {
        const courses = await Course.find({}).select("-lectures");
    
    res.status(200).json({
        success: true,
        message: "All courses fetched successfully",
        courses, // This should be replaced with actual course data
    });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
    
}

const getLecturesByCourseId = async function (req, res, next) {
    try {
         const { id } = req.params;
        //  console.log(`Fetching lectures for course ID: ${id}`);
         
        const course = await Course.findById(id);

        // console.log(`Course found: ${course ? course.title : 'not found'}`);

        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Lectures fetched successfully",
            lectures: course.lectures,
        });
        
    } catch (error) {
        return next(new AppError(error.message, 500));
        
    }
}

const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All fields are required", 400));
  }

  try {
    // Step 1: Create course with dummy thumbnail initially
    const course = await Course.create({
      title,
      description,
      thumbnail: {
        public_id: 'Dummy',
        secure_url: 'Dummy'
      },
      category,
      createdBy,
    });

    if (!course) {
      return next(new AppError("Course creation failed", 500));
    }

    // Step 2: If a file is uploaded, use memory buffer to upload to Cloudinary
    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            {
              folder: "lms"
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();

      // Step 3: Replace dummy thumbnail with Cloudinary image
      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }
    }

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};
// const addLecture = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { title, description } = req.body;

//         // Upload lecture video to Cloudinary
//         const result = await cloudinary.v2.uploader.upload(req.file.path, {
//             resource_type: "video",
//             folder: "course_lectures"
//         });

//         const course = await Course.findById(id);
//         if (!course) {
//             return next(new AppError("Course not found", 404));
//         }

//         course.lectures.push({
//             title,
//             description,
//             lecture: {
//                 public_id: result.public_id
//             },
//             secure_url: result.secure_url
//         });

//         course.numberOfLectures = course.lectures.length;
//         await course.save();

//         res.status(201).json({
//             success: true,
//             message: "Lecture added successfully",
//             lectures: course.lectures
//         });
//     } catch (e) {
//         return next(new AppError(e.message, 500));
//     }
// };

const updateCourse = async (req, res, next) => {

    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body,

            },
            {
               
                runValidators: true,
            }
        );
        if (!course) {
            return next(new AppError("Course with given id not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });

    } catch (e) {
        return next(new AppError(e.message, 500));
        
    }
}

const removeCourse = async (req, res, next) => {

    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return next(new AppError("Course with given id not found", 404));
        }

        await Course.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const addLectureToCourseById = async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return next(new AppError("Title and description are required", 400));
  }

  const course = await Course.findById(id);
  if (!course) {
    return next(new AppError("Course with given id not found", 404));
  }

  const lectureData = {
    title,
    description,
  };

  if (req.file) {
    try {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "course_lectures",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();

      if (result) {
        lectureData.lecture = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      }
    } catch (error) {
      return next(new AppError("Failed to upload lecture video", 500));
    }
  }

  course.lectures.push(lectureData);
  course.numberOfLectures = course.lectures.length;
  await course.save();

  res.status(201).json({
    success: true,
    message: "Lecture added to course successfully",
    course,
  });
};


const deleteLectureFromCourse = async (req, res, next) => {
    const { id, lectureId } = req.params;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        // Find the lecture to delete
        const lecture = course.lectures.id(lectureId);
        if (!lecture) {
            return next(new AppError("Lecture not found", 404));
        }

        // Optionally: Delete lecture video from Cloudinary
        if (lecture.lecture && lecture.lecture.public_id) {
            try {
                await cloudinary.v2.uploader.destroy(lecture.lecture.public_id, { resource_type: "video" });
            } catch (err) {
                // Log error but continue
                // console.error("Cloudinary delete error:", err);
            }
        }

        // Remove lecture from array
        course.lectures.id(lectureId).deleteOne();
        course.numberOfLectures = course.lectures.length;
        await course.save();

        res.status(200).json({
            success: true,
            message: "Lecture deleted successfully",
            course
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

export { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse , addLectureToCourseById , deleteLectureFromCourse };

