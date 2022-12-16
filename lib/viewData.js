const etDB = require('../config/connection');
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
}

module.exports = ViewData;