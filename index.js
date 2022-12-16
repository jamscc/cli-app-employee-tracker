const inquirer = require('inquirer');
const ViewData = require('./lib/viewData');
const InsertData = require('./lib/insertData');

// options - see prompt 
const optionSel = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Done'
];

// start tracker
function intro() {
    console.info(`
    ------------------ [EMPLOYEE TRACKER] ------------------
    
    ======================================================
    `);
    // prompt
    promptsDisplay();
}

// end tracker 
function endTracker() {
    console.info('Done');
    process.exit();
}

function promptsDisplay() {
    // prompt
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'Please select one of the following:',
            choices: optionSel
        },

    ])
        .then((resp) => {
            // view, insert 
            const viewData = new ViewData(resp.options, promptsDisplay);
            const insertData = new InsertData(promptsDisplay);
            
            switch (resp.options) {
                case ('View all departments'):
                    viewData.viewTable();
                    break;
                case ('View all roles'):
                    viewData.viewTable();
                    break;
                case ('View all employees'):
                    viewData.viewTable();
                    break;
                case ('Add a department'):
                    insertData.addDepartment();
                    break;
                case ('Add a role'):
                    insertData.addRole();
                    break;
                case ('Add an employee'):
                    insertData.addEmployee();
                    break;    
                default:
                    // end tracker
                    endTracker();
            }
        })
}

// start intro
intro();