const etDB = require('../config/connection');
const inquirer = require('inquirer');

class InsertData {
    constructor(prompts) {
        this.displayPrompts = prompts;
    }

    // query and show options
    insertData(dbQuery, dataInsert, insertDesc) {
        const dbInsert = new Promise((resolve, reject) => {
            etDB.query(dbQuery, dataInsert, (error, dataDB) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(dataDB);
                }
            });
        }
        )
        dbInsert.then(() => {
            // message
            console.log(`
      This ${insertDesc} has been added.
      `);
            // show options
            this.displayPrompts();
        })
    }

    // add a department
    async addDepartment() {
        // prompt
        const dataDepartment = await inquirer.prompt([
            {
                type: 'Input',
                name: 'depName',
                message: "Enter the department's name:"
            }
        ])
        // for insert
        const insertDesc = 'department'
        const dbQuery = `INSERT INTO department (name) VALUES (?);`
        const dataInsert = [dataDepartment.depName]
        this.insertData(dbQuery, dataInsert, insertDesc)
    }

    // add a role
    addRole() {
        // department data 
        const depList = new Promise((resolve, reject) => {
            etDB.query(`SELECT * FROM department ORDER BY name`, (error, dataDB) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(dataDB);
                }
            })
        });

        // array - departments (for prompt - see below)
        depList.then((departmentList) => {
            const departmentOptions = [];
            for (let i = 0; i < departmentList.length; i++) {
                const depID = {
                    name: departmentList[i].name,
                    value: departmentList[i].id
                }
                departmentOptions.push(depID)
            }

            // prompts
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'titleRole',
                    message: 'Enter the title of the role:'
                },

                {
                    type: 'input',
                    name: 'salaryRole',
                    message: 'Enter the salary for the role:'
                },

                {
                    type: 'list',
                    name: 'depNameID',
                    message: 'This role is under (select the department):',
                    choices: departmentOptions
                }

            ]).then((roleInfo) => {
                const { titleRole, salaryRole, depNameID } = roleInfo;

                // for insert
                const insertDesc = 'role'
                const dbQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`
                const dataInsert = [titleRole, salaryRole, depNameID]
                this.insertData(dbQuery, dataInsert, insertDesc);
            })
        })
    }

    // add an employee
    addEmployee() {
        // all employees - first and last names
        const empAll = new Promise((resolve, reject) => {
            etDB.query(`SELECT id, concat(first_name, ' ', last_name) AS full_name FROM employee`, function (error, dbData) {
                if (error) {
                    reject(error);
                } else {
                    resolve(dbData);
                }
            })
        })

        // all roles
        const roleAll = new Promise((resolve, reject) => {
            etDB.query(`SELECT * FROM role`, function (error, dbData) {
                if (error) {
                    reject(error);
                } else {
                    resolve(dbData);
                }
            })
        })

        Promise.all([empAll, roleAll]).then((dbDataAll) => {

            const dataEmployee = dbDataAll[0];
            const roleData = dbDataAll[1];

            // array - roles (for prompt - see below)
            const roleOptions = [];
            for (let i = 0; i < roleData.length; i++) {
                const roleTitleID = {
                    name: roleData[i].title,
                    value: roleData[i].id
                };
                roleOptions.push(roleTitleID);
            };

            // array - managers (for prompt - see below)
            const mgrOptions = [{name: 'None', value: null}];
            for (let i = 0; i < dataEmployee.length; i++) {
                const mgrNameID = {
                    name: dataEmployee[i].full_name,
                    value: dataEmployee[i].id
                }
                mgrOptions.push(mgrNameID)
            };

            // prompts
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the first name of the employee:'
                },

                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the last name of the employee:'
                },

                {
                    type: 'list',
                    name: 'idRole',
                    message: 'The role of the employee:',
                    choices: roleOptions
                },

                {
                    type: 'list',
                    name: 'idMgr',
                    message: 'The manager of the employee:',
                    choices: mgrOptions
                }


            ]).then((employeeInfo) => {
                const { firstName, lastName, idRole, idMgr } = employeeInfo;

                // for insert
                const insertDesc = 'information about the employee'
                const dbQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`
                const dataInsert = [firstName, lastName, idRole, idMgr]
                this.insertData(dbQuery, dataInsert, insertDesc);
            })
        })
    }
}

module.exports = InsertData;