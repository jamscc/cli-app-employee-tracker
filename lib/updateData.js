const etDB = require('../config/connection');
const inquirer = require('inquirer');

class UpdateData {
    constructor(prompts) {
        this.displayPrompts = prompts;
    }

    updateRole() {
        // all employees - first and last names
        const employeeAll = new Promise((resolve, reject) => {
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

        Promise.all([employeeAll, roleAll]).then((dbDataAll) => {

            const dataEmployee = dbDataAll[0];
            const roleData = dbDataAll[1];

            // array - employees (for prompt - see below)
            const employeeList = [];
            for (let i = 0; i < dataEmployee.length; i++) {
                const employeeNameID = {
                    name: dataEmployee[i].full_name,
                    value: dataEmployee[i].id
                };
                employeeList.push(employeeNameID);
            }

            // array - roles (for prompt - see below)
            const roleOptions = [];
            for (let i = 0; i < roleData.length; i++) {
                const roleTitleID = {
                    name: roleData[i].title,
                    value: roleData[i].id
                };
                roleOptions.push(roleTitleID);
            }

            // prompts
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Update the role of:',
                    choices: employeeList
                },

                {
                    type: 'list',
                    name: 'roleUpdate',
                    message: 'Select the new / updated role:',
                    choices: roleOptions
                }

            ]).then((empInfo) => {
                const { employee, roleUpdate } = empInfo;

                // query
                const dataUpdate = new Promise((resolve, reject) => {
                    etDB.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [roleUpdate, employee], (error, dataDB) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(dataDB);
                        }
                    })
                })
                
                dataUpdate.then(() => {
        // message
        console.log(`
    The employee's role has been updated.
        `)
                    // show options
                    this.displayPrompts();
                })
            })
        })
    }
}

module.exports = UpdateData;