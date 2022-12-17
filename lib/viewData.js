const etDB = require('../config/connection');
const inquirer = require('inquirer');
const tbPT = require('console.table');

class ViewData {
    // selected option, prompt
    constructor(resp, prompts) {
        this.resp = resp;
        this.displayPrompts = prompts;
    }

    // view data - departments, roles, or employees
    viewTable() {
        const vData = new Promise((resolve, reject) => {
            let queryDB;
            switch (true) {
                case (this.resp == 'View all employees'):
                    queryDB = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, (SELECT concat(mgrEmployee.first_name, ' ', mgrEmployee.last_name) AS manager FROM employee mgrEmployee WHERE mgrEmployee.id = employee.manager_id) AS manager
                    FROM employee
                    LEFT JOIN role ON employee.role_id = role.id
                    JOIN department ON role.department_id = department.id
                    ORDER BY department ASC, manager ASC;`;
                    break;
                case (this.resp == 'View all roles'):
                    queryDB = `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY department`;
                    break;
                default:
                    queryDB = `SELECT * FROM department`;
            }
            // query
            etDB.query(queryDB, (error, dataDB) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(dataDB);
                }
            })
        })

        vData.then((dataDB) => {
            // https://www.npmjs.com/package/console.table
            // table
            const ptTB = tbPT.getTable(dataDB);
            console.log(`
                `);
            console.log(ptTB);
            // show options
            this.displayPrompts();
        })
    }

    viewBudget() {
        // departments 
        const depList = new Promise((resolve, reject) => {
            etDB.query(`SELECT * FROM department ORDER BY name`, (error, dataDB) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(dataDB);
                }
            })
        });

        depList.then((departmentList) => {
            // array - departments (for prompt - see below)
            const departmentOptions = [];
            for (let i = 0; i < departmentList.length; i++) {
                const depID = {
                    name: departmentList[i].name,
                    value: departmentList[i].id
                }
                departmentOptions.push(depID);
            }
            // prompt
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'depNameID',
                    message: 'Select a department to view its total utilized budget:',
                    choices: departmentOptions
                }

            ]).then((departmentSel) => {
                // total utilized budget
                const vData = new Promise((resolve, reject) => {
                    let queryDB = `SELECT department.name AS department, SUM(role.salary) AS total_utilized_budget FROM employee LEFT JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id GROUP BY role.department_id HAVING role.department_id = ?`
                    etDB.query(queryDB, [departmentSel.depNameID], (error, dataDB) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(dataDB);
                        }
                    })
                });

                vData.then((dataDB) => {
                    const departmentInfo = departmentOptions.filter((depInfo) => depInfo.value == departmentSel.depNameID);
                    // not utilized / utilized
                    let depBudget;
                    switch (true) {
                        case (dataDB == ''):
                            const depData = [{
                                department: departmentInfo[0].name,
                                total_utilized_budget: 0 
                            }];
                            depBudget = depData;
                        break;
                        default:
                            depBudget = dataDB;
                    }
                    // https://www.npmjs.com/package/console.table
                    // table
                    const ptTB = tbPT.getTable(depBudget);
                    console.log(`
                        `);
                    console.log(ptTB);
                    // show options
                    this.displayPrompts()
                });
            })
        })
    }
}

module.exports = ViewData;