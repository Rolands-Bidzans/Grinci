const data = {
    employees: require('../models/employees.json'),
    setEmployees: function (data) { this.employees = data }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
}

const createNewEmployee = (req, res) => {
    const newEmployee = {
        'firstname': req.body.firstname,
        'lastname': req.body.lastname
    };

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message' : 'First and last name are required.' })
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
}

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === paseInt(req.body.id));
    if(!employee)
    {
        return res.status(400).json({'message': `Employee ID ${req.body.id} not found`})
    }
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;

    const filteredArray = data.employees.fillter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort( (a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === paseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ 'message': `Employee ID ${req.body.id} not found` })
    }

    res.json(data.employees)
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === paseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ 'message': `Employee ID ${req.body.id} not found` })
    }
    res.json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}