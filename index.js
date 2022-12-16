const inquirer = require('inquirer');
const ViewData = require('./lib/viewData');

// options - see prompt 
const optionSel = [
    'View all departments',
    'View all roles',
    'View all employees',
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
            // view 
            const viewData = new ViewData(resp.options, promptsDisplay);
            
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
                default:
                    // end tracker
                    endTracker();
            }
        })
}

// start intro
intro();