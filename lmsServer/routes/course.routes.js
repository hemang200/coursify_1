import { Router } from "express";
import { getAllCourses, getLecturesByCourseId, createCourse,updateCourse,removeCourse , addLectureToCourseById ,deleteLectureFromCourse} from "../controllers/course.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn,authorizedRoles,authorizeSubscriber } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
        .get(getAllCourses)
        .post(isLoggedIn, authorizedRoles('admin') ,upload.single('thumbnail') ,createCourse)
        // .post(addLecture)
       

router.route("/:id")
            .get( isLoggedIn , authorizeSubscriber, getLecturesByCourseId)
            .put(isLoggedIn , authorizedRoles('admin'),updateCourse)
            .delete(isLoggedIn , authorizedRoles('admin'),removeCourse)
            .post(isLoggedIn, authorizedRoles('admin'),  upload.single('lecture'), addLectureToCourseById);

            router.delete(
                    "/:id/lectures/:lectureId",
                    isLoggedIn,
                    authorizedRoles('admin'),
                    deleteLectureFromCourse
);

export default router;
