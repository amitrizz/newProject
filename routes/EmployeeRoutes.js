import express from 'express';
import {
    getAllEmployee,
    addEmployee,
    searchEmployee,
    sortEmployeetable,
    updateEmployee,
    deleteEmployee,
    avgDepartmentSalary,
    avgEmployeeSalary,
    sortGroupEmployeetable
} from '../controllers/EmployeeDataController.js'
const router = express.Router();

router.get('/getAll-employee',getAllEmployee)
router.post('/search-employee',searchEmployee)
router.post('/add-employee',addEmployee)
router.delete('/delete-employee/:id',deleteEmployee)   
router.post('/update-employee',updateEmployee)

//filters 
// sort based on employee department salary age    
router.post('/sort-data',sortEmployeetable)
router.post('/group-department',sortGroupEmployeetable) // sort the output data

 
router.post('/avg-department-salary',avgDepartmentSalary)
router.get('/avg-employee-salary',avgEmployeeSalary)
//private
// router.post('/add-blog-post',BlogController.createBlogpost);
// router.get('/get-all-user-blogs',BlogController.getAllBlogsOfUser);
// router.post('/update-blog',BlogController.updateOneBlogOfUser);
// router.delete('/delete-blog',BlogController.deleteOneBlogOfUser);
export default router;



/////////////////////////
// import express from "express";

// const  router = express.Router();


// // route for getting all employees
// router.get('/employees',getAllEmployeeController);

// // route for adding new an employee
// router.post('/employees/add',addEmployeeController);

// //route for filter the employees
// router.get('/employees/filter',filterEmployeeController);

// // route for searching the employees based on the name
// router.get('/employees/search',searchEmployeeController);

// // route for update an employee record
// router.put('/employees/update/:id',updateEmployeeController);

// // route for deleting an employee
// router.delete('/employees/delete/:id',deleteEmployeeController);

// export default router;