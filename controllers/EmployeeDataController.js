import fs from "fs";
import uniqid from "uniqid";

export const readEmployees = async () => {
    try {
        const dataBuffer = fs.readFileSync("./employees.json", "utf-8");
        return JSON.parse(dataBuffer);
    } catch (error) {
        console.log("Error in loading the employees", error.message);
        return [];
    }
};

const writeEmployees = (newEmployees) => {
    try {
        const dataJSON = JSON.stringify(newEmployees, null, 2);
        fs.writeFileSync("./employees.json", dataJSON);
    } catch (error) {
        console.log("Error in saving the employees", error.message);
    }
};

export const getAllEmployee = async (req, res) => {
    try {
        let employees = await readEmployees();
        res.status(200).json({ success: true, employees });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in getting all employees",
            error: error.message,
        });
    }
};

export const addEmployee = async (req, res) => {
    try {
        let { fullname, age, dob, salary, department } = req.body;

        if (!fullname || !age || !dob || !salary || !department) {
            res.status(400).json({ status: "failed", message: "All fields are required" });
            return;
        }

        const id = uniqid();
        salary = parseInt(salary);
        age = parseInt(age);
        const newEmployee = { id, fullname, age, dob, salary, department };
        let employees = await readEmployees();
        employees.push(newEmployee);
        await writeEmployees(employees);

        res.status(200).json({ status: "success", message: "Employee saved successfully", employee: newEmployee });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal server error" });
    }
};

export const sortEmployeetable = async (req, res) => {
    try {
        const { type } = req.body;

        if (!type) {
            res.status(400).json({ status: "failed", message: "Please provide a sorting type" });
            return;
        }

        const lowercaseType = type.toLowerCase();

        let employees;

        if (["fullname", "age", "department", "salary", "dob"].includes(lowercaseType)) {
            employees = await readEmployees();
            // employees = await readEmployees();
            employees.sort((a, b) => {
                const fieldA = a[lowercaseType].toString().toLowerCase();
                const fieldB = b[lowercaseType].toString().toLowerCase();
                if (fieldA < fieldB) return -1;
                if (fieldA > fieldB) return 1;
                return 0;
            });
            res.status(200).json({ status: "success", employees });
        } else {
            res.status(400).json({ status: "failed", message: "Invalid sorting type" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Unable to sort the employee data" });
    }
};

export const searchEmployee = async (req, res) => {
    try {
        const { fullname } = req.body;
        console.log(fullname);
        let employees = await readEmployees();
        // const employees = await readEmployees();
        // console.log(employees);
        const searchResult = employees.filter(employee => employee.fullname.toLowerCase().includes(fullname.toLowerCase()));

        if (!searchResult.length) {
            res.status(404).json({ status: "failed", message: "Employee not found" });
            return;
        }
        res.status(200).json({ status: "success", searchResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to search for employee" });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        let { fullname, age, dob, salary, department, id } = req.body;
        console.log(req.body);
        if (!fullname || !age || !dob || !salary || !department) {
            res.status(400).json({ status: "failed", message: "All fields are required" });
            return;
        }

        let employees = await readEmployees();
        console.log(id);
        // console.log(employees);
        const index = employees.findIndex(employee => employee.id == id);

        if (index === -1) {
            res.status(404).json({ status: "failed", message: "Employee not found" });
            return;
        }
        // console.log("done");
        salary = parseInt(salary);
        age = parseInt(age);
        employees[index] = { id, fullname, age, dob, salary, department };
        await writeEmployees(employees);

        res.status(200).json({ status: "success", message: "Employee updated successfully", employee: employees[index] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to update employee" });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        // const { id } = req.body.authorization.split(' ')[2];
        // console.log(req.params);
        const { id } = req.params;


        if (!id) {
            res.status(400).json({ status: "failed", message: "Employee ID is not present" });
            return;
        }

        let employees = await readEmployees();
        const initialLength = employees.length;
        employees = employees.filter(employee => employee.id != id);
        const deletedCount = initialLength - employees.length;

        if (deletedCount === 0) {
            res.status(404).json({ status: "failed", message: "Employee not found" });
            return;
        }

        await writeEmployees(employees);

        res.status(200).json({ status: "success", message: "Employee deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to delete employee" });
    }
};

export const avgDepartmentSalary = async (req, res) => {
    try {
        const { department } = req.body;
        console.log(req.body);
        if (!department) {
            res.status(400).json({ status: "failed", message: "Please provide a department" });
            return;
        }

        const employees = await readEmployees();

        const salaries = employees.filter(employee => employee.department == department).map(employee => employee.salary);

        // if (!salaries.length) {
        //     res.status(400).json({ status: "failed", message: "Invalid department or no employees found in the department" });
        //     return;
        // }

        const calculateAverage = (arr) => {
            if (arr.length === 0) return 0; // Handle empty array
            const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue);
            return sum / arr.length;
        };
        const averageSalary = calculateAverage(salaries);

        res.status(200).json({ status: "success", avgDeptSalary: averageSalary });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Unable to get employee data" });
    }
};

export const avgEmployeeSalary = async (req, res) => {
    try {
        const employees = await readEmployees();
        console.log("yes");
        if (!employees.length) {
            res.status(400).json({ status: "failed", message: "No employees in the database" });
            return;
        }

        const salaries = employees.map(employee => employee.salary);

        const noOfEmployee = employees.length;
        const calculateAverage = (arr) => {
            if (arr.length === 0) return 0; // Handle empty array
            const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue);
            return sum / arr.length;
        };
        const averageSalary = calculateAverage(salaries);

        res.status(200).json({ status: "success", avgEmpSalary: averageSalary, noOfEmployee });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Unable to calculate average salary" });
    }
};

export const sortGroupEmployeetable = async (req, res) => {
    try {
        const { department } = req.body;

        if (!department) {
            res.status(400).json({ status: "failed", message: "Please provide a department" });
            return;
        }

        const employees = await readEmployees();
        const sortedGroupDept = employees.filter(employee => employee.department === department).sort((a, b) => a.salary - b.salary);

        res.status(200).json({ status: "success", sortedGroupDept });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Unable to sort group of employee data" });
    }
};