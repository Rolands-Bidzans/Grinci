const express = require('express');
const router = express.Router();
const path = require('path');
const budgetController = require(path.join(__dirname, '..', '..', 'controllers', 'budgetController'));

/*const styles = ['css/dashboard.css'];*/
const styles = ['css/budget.css'];
const scripts = ['js/budget.js'];
const title = 'BUDGET';
router.get('/', (req, res) => {
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'budget.ejs'), {
        title: title,
        username: username,
        pageName: title,
        styles: styles,
        scripts: scripts
    });
});

router.post('/getAllBudgets', budgetController.getAllBudgets);

router.post('/addBudget', budgetController.addBudget);
router.post('/changeBudgetStatus', budgetController.changeBudgetStatus);

module.exports = router;
