class TradePartnerCommission {
    constructor(trade_partner_id) {
        this.trade_partner_id = trade_partner_id;
        this.commission_owed = 0;
    }
}

class CommissionCalculator {
    calculateCommission(payment_cycle_start_date, payment_cycle_end_date) {
        const tradePartnerCommissions = {};

        // Iterate through Sales Orders
        for (const salesOrder of salesOrders) {
            if (salesOrder.order_placed_date >= payment_cycle_start_date && salesOrder.order_placed_date <= payment_cycle_end_date) {
                for (const item of salesOrder.item_sublist) {
                    if (item.item_type === 'physical' && moreThan30DaysPassed(item.delivery_date)) {
                        const commission = 0.12 * item.total_amount;
                        if (salesOrder.trade_partner) {
                            if (!tradePartnerCommissions[salesOrder.trade_partner]) {
                                tradePartnerCommissions[salesOrder.trade_partner] = new TradePartnerCommission(salesOrder.trade_partner);
                            }
                            tradePartnerCommissions[salesOrder.trade_partner].commission_owed += commission;
                        }
                    }
                }
            }
        }

        // Iterate through Credit Memos
        for (const creditMemo of creditMemos) {
            if (creditMemo.date >= payment_cycle_start_date && creditMemo.date <= payment_cycle_end_date) {
                for (const item of creditMemo.item_sublist) {
                    if (item.item_type === 'physical') {
                        const refundedAmount = item.total_amount;
                        if (creditMemo.trade_partner) {
                            if (!tradePartnerCommissions[creditMemo.trade_partner]) {
                                tradePartnerCommissions[creditMemo.trade_partner] = new TradePartnerCommission(creditMemo.trade_partner);
                            }
                            tradePartnerCommissions[creditMemo.trade_partner].commission_owed -= refundedAmount;
                        }
                    }
                }
            }
        }

        // Print or store commission owed to each trade partner
        for (const tradePartnerId in tradePartnerCommissions) {
            const commission = tradePartnerCommissions[tradePartnerId].commission_owed;
            if (commission > 0) {
                console.log(`Trade Partner: ${tradePartnerId}, Commission Owed: ${commission}`);
            }
        }
    }
}

// Helper function to check if more than 30 days have passed
function moreThan30DaysPassed(date) {
    const today = new Date();
    const deliveryDate = new Date(date);
    const diffTime = Math.abs(today - deliveryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30;
}

// Usage
const calculator = new CommissionCalculator();
calculator.calculateCommission(paymentCycleStartDate, paymentCycleEndDate);
