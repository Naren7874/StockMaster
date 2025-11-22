const express = require('express');
const {
    createTransaction,
    getTransactions,
    validateTransaction,
    createIn,
    createOut,
    createTransfer,
    createAdjust,
    updateStatus,
    getHistory,
    createReorder,
    updateTransaction
} = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getTransactions);
router.get('/history', authenticateToken, getHistory);
router.post('/', authenticateToken, createTransaction);
router.post('/in', authenticateToken, createIn);
router.post('/out', authenticateToken, createOut);
router.post('/transfer', authenticateToken, createTransfer);
router.post('/adjust', authenticateToken, createAdjust);
router.post('/:id/validate', authenticateToken, validateTransaction);
router.post('/:id/complete', authenticateToken, validateTransaction);
router.post('/:id/status', authenticateToken, updateStatus);
router.post('/reorder/:productId/:warehouseId', authenticateToken, createReorder);
router.put('/:id', authenticateToken, updateTransaction);

module.exports = router;
