// Import required modules
const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Chalk = require("chalk");

// inquirer's prompt module
const prompt = inquirer.createPromptModule();


connection.connect((error) => {
    if (error) throw error;
});

// Initial prompt to start or exit the application
prompt([
    {
        type: "list",
        message: `${Chalk.black.bgCyan("Welcome to Employee Tracker. Select continue to begin.")}`,
        choices: ["Continue", "Quit"],
        name: "start",
    },
]).then((response) => {
    // If "Continue" is selected, show the main menu
    // If "Quit" is selected, log a message and exit
    switch (response.start) {
        case "Continue":
            showMainMenu();
            break;
        case "Quit":
            return console.log("Restart the application and try again.");
    }
});

//show the main menu 
function showMainMenu() {
    prompt([
        {
            name: "option",
            type: "list",
            message: Chalk.black.bgGreen("Which action would you like to perform?"),
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "Update Employee Role",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Delete Department",
                "Delete Roles",
                "Delete Employee",
                "View Department Budget",
                "Exit",
            ],
        },
    ]).then((answers) => {
        const { option } = answers;
        switch (option) {
            case "View All Employees":
                viewAEmployees();
                break;
            case "View All Roles":
                viewARoles();
                break;
            case "View All Departments":
                viewADeparments();
                break;
            case "Update Employee Role":
                updateERoles();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Delete Department":
                deleteDepartment();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Delete Employee":
                deleteEmployee();
                break;
            case "View Department Budget":
                viewDepartmentBudget();
                break;
            case "Exit":
                console.log("Thanks for using Employee Tracker. Until next time.");
                connection.end();
                break;
        }
    });
}
const viewAEmployees = () => {
    const sql = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS 'department', role.salary FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id ORDER BY employee.id ASC";
    // execute the SQL query
    connection.query(sql, (error, response) => {
        if (error) throw error;
        console.log(
            "------------------------------------------------------------------"
        );
        console.log(Chalk.greenBright("All Employees:\n"));
        console.table(response);
        console.log(
            "------------------------------------------------------------------"
        );
        showMainMenu();
    });
};

const viewARoles = () => {
    
    const sql = "SELECT * FROM role";
    
    connection.query(sql, (error, response) => {
        if (error) throw error;
        console.log("------------------------------------------------------------------");
        console.log(Chalk.greenBright("All Roles:\n"));
        console.table(response);
        console.log("------------------------------------------------------------------");
        showMainMenu();
    });
};

const viewADeparments = () => {
    
    const sql = "SELECT * FROM department";
    
    connection.query(sql, (error, response) => {
        if (error) throw error;
        
        console.log(
            "------------------------------------------------------------------"
        );
        console.log(Chalk.greenBright("All Departments:\n"));
        console.table(response);
        console.log(
            "------------------------------------------------------------------"
        );
        
        showMainMenu();
    });
};

// function to update an employee's role
const updateERoles = () => {
    
    const sql = "SELECT * FROM employee";
    // execute the SQL query
    connection.query(sql, (error, response) => {
        if (error) throw error;
        
        const employee = response.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        // prompt the user to select an employee
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: Chalk.black.bgGreen("Which employee's role would you like to update?"),
                choices: employee,
            },
        ]).then((employeeAnswer) => {
            // get the selected employee's id
            const { employeeId } = employeeAnswer;
            
            const sql = "SELECT * FROM role";
            // execute the SQL query
            connection.query(sql, (error, response) => {
                if (error) throw error;
                // Map the roles to a format 
                const role = response.map((role) => ({
                    name: role.title,
                    value: role.id,
                }));
                //  prompt first name, last name, role, and manager ID
                prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: Chalk.black.bgGreen("What is the new role?"),
                        choices: role,
                    },
                ]).then((roleAnswer) => {
                    const { roleId } = roleAnswer;
                    const sql = "UPDATE employee SET role_id = ? WHERE id = ?";
                    connection.query(sql, [roleId, employeeId], (error) => {
                        if (error) throw error;
                        console.log(
                            Chalk.black.bgGreen(
                                `Successfully updated role for employee with ID ${employeeId}.`
                            )
                        );
                        showMainMenu();
                    });
                });
            });
        });
    });
};

const addEmployee = () => {
    const sql = "SELECT * FROM role";
    connection.query(sql, (error, response) => {
        if (error) throw error;
        const role = response.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        prompt([
            {
                type: "input",
                name: "firstName",
                message: Chalk.black.bgGreen("What is the employee's first name?"),
            },
            {
                type: "input",
                name: "lastName",
                message: Chalk.black.bgGreen("What is the employee's last name?"),
            },
            {
                type: "list",
                name: "roleId",
                message: Chalk.black.bgGreen("What is the employee's role?"),
                choices: role,
            },
            {
                type: "input",
                name: "managerId",
                message: Chalk.black.bgGreen("What is the employee's manager's id?"),
            },
        ]).then((answer) => {
            const { firstName, lastName, roleId, managerId } = answer;
            //employee into the database
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: roleId,
                    manager_id: managerId,
                },
                (error) => {
                    if (error) throw error;
                    
                    console.log(
                        `Employee ${firstName} ${lastName} was added successfully to the database.
        `);
                    showMainMenu();
                }
            );
        });
    });
};

const addRole = () => {
    // Select the database
    const sql = "SELECT * FROM department";
    connection.query(sql, (error, response) => {
        if (error) throw error;
        //object with name and value properties
        const department = response.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));
        // promt title, salary, 
        prompt([
            {
                type: "input",
                name: "title",
                message: Chalk.black.bgGreen("What is the title of the new role?"),
            },
            {
                type: "input",
                name: "salary",
                message: Chalk.black.bgGreen("What is the salary of the new role?"),
            },
            {
                type: "list",
                name: "departmentId",
                message: Chalk.black.bgGreen("What department does the new role belong to?"),
                choices: department,
            },
        ]).then((answer) => {
            const { title, salary, departmentId } = answer;

            connection.query(
                "INSERT INTO role SET ?",
                {
                    title,
                    salary,
                    department_id: departmentId,
                },
                (error) => {
                    if (error) throw error;
                    console.log(`The role ${title} was added successfully to the database.`);
                    // Show the main menu after the new role has been added
                    showMainMenu();
                }
            );
        });
    });
};

const addDepartment = () => {
    
    prompt([
        {
            type: "input",
            name: "departmentName",
            message: Chalk.black.bgGreen("What is the name of the new department?"),
        },
    ]).then((answer) => {
        const { departmentName } = answer;
        // Insert the new department into the database
        connection.query(
            "INSERT INTO department SET ?",
            {
                department_name: departmentName,
            },
            (error) => {
                if (error) throw error;
                console.log(
                    Chalk.black.bgGreen(`
            The department ${departmentName} was added successfully to the database.
            `)
                );
                showMainMenu();
            }
        );
    });
};

const deleteDepartment = () => {
    // Select all departments
    const sql = "SELECT * FROM department";    
    connection.query(sql, (error, response) => {
        // If there is an error, throw it
        if (error) throw error;
        const department = response.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));       
        prompt([
            {
                type: "list",
                name: "departmentId",
                message: Chalk.black.bgGreen("Which department would you like to delete?"),
                choices: department,
            },
        ]).then((answer) => {
            // Get the selected department id
            const { departmentId } = answer;
            connection.query("DELETE FROM department WHERE id = ?", [departmentId], (error) => {
                // If there is an error, throw it
                if (error) throw error;                
                console.log(
                    Chalk.black.bgGreen(
                        `Successfully deleted department with ID ${departmentId}.`
                    )
                );
                // Show the main menu
                showMainMenu();
            });
        });
    });
};
const deleteRole = () => {
    // Select all roles
    const sql = "SELECT * FROM role";
    // Query the database for roles
    connection.query(sql, (error, response) => {
        // If there is an error, throw it
        if (error) throw error;
        // Create an array of roles with their title and id
        const role = response.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        // Prompt the user to select a role to delete
        prompt([
            {
                type: "list",
                name: "roleId",
                message: Chalk.black.bgGreen("Which role would you like to delete?"),
                choices: role,
            },
        ]).then((answer) => {           
            const { roleId } = answer;
            connection.query("DELETE FROM role WHERE id = ?", [roleId], (error) => {
                // If there is an error, throw it
                if (error) throw error;

                // Log a message indicating that the role was successfully deleted
                console.log(
                    Chalk.black.bgGreen(
                        `Successfully deleted role with ID ${roleId}.`
                    )
                );
               
                showMainMenu();
            });
        });
    });
};
const deleteEmployee = () => {
    // Select all employees
    const sql = "SELECT * FROM employee";
    connection.query(sql, (error, response) => {
        // If error 
        if (error) throw error;

        const employee = response.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: Chalk.black.bgGreen("Which employee would you like to delete?"),
                choices: employee,
            },
        ]).then((answer) => {           
            const { employeeId } = answer;
            connection.query("DELETE FROM employee WHERE id = ?", [employeeId], (error) => {
                if (error) throw error;
                console.log(
                    Chalk.black.bgGreen(
                        `Successfully deleted employee with ID ${employeeId}.`
                    )
                );
               
                showMainMenu();
            });
        });
    });
};

const viewDepartmentBudget = () => {


    const sql = "SELECT * FROM department";

    connection.query(sql, (error, departments) => {
        // If there's an error, throw the error
        if (error) throw error;

        const departmentChoices = departments.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));
        // Use the prompt module to display a list of departments
        prompt([
            {
                type: "list",
                name: "departmentId",
                message: Chalk.black.bgGreen("Which department's budget would you like to view?"),
                choices: departmentChoices,
            },

            // total budget of a department
        ]).then((answer) => {
            const { departmentId } = answer;
            const sql = `
                      SELECT SUM(role.salary) AS budget
                      FROM employee
                      JOIN role ON employee.role_id = role.id
                      JOIN department ON role.department_id = department.id
                      WHERE department.id = ${departmentId};
                    `;
            // Query the database to get the budget of the selected department
            connection.query(sql, [departmentId], (error, result) => {
                // If there's an error, throw the error
                if (error) throw error;
                // find and log budget 
                console.log(
                    Chalk.black.bgGreen(
                        `The budget for department with ID ${departmentId} is $${result[0].budget}.`
                    )
                );
                // go to main menu 
                showMainMenu();
            });
        });
    });
};