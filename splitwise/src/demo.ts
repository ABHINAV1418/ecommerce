import { SplitwiseSystem } from './models/SplitwiseSystem';
import { SplitType } from './models/Group';
import { ExpenseCategory } from './models/Expense';
import { SettlementMethod } from './models/Settlement';

async function runDemo() {
    console.log('=== Splitwise Demo ===\n');
    
    // Initialize the Splitwise system
    const splitwiseSystem = new SplitwiseSystem();
    console.log('Splitwise system initialized with default admin user\n');
    
    // Login as admin
    try {
        const admin = splitwiseSystem.login('admin@example.com', 'admin123');
        console.log(`Logged in as admin: ${admin.name} (${admin.email})\n`);
    } catch (error: any) {
        console.error(`Error logging in as admin: ${error.message}`);
        return;
    }
    
    // Register some users
    console.log('=== Registering Users ===');
    const users = [
        { name: 'John Doe', email: 'john@example.com', password: 'password123', phone: '1234567890' },
        { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', phone: '2345678901' },
        { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123', phone: '3456789012' },
        { name: 'Alice Brown', email: 'alice@example.com', password: 'password123', phone: '4567890123' }
    ];
    
    for (const userData of users) {
        try {
            const user = splitwiseSystem.registerUser(userData.name, userData.email, userData.password, userData.phone);
            console.log(`Registered user: ${user.name} (${user.email})`);
        } catch (error: any) {
            console.error(`Error registering user ${userData.name}: ${error.message}`);
        }
    }
    console.log();
    
    // Login as John
    let currentUser;
    try {
        currentUser = splitwiseSystem.login('john@example.com', 'password123');
        console.log(`Logged in as: ${currentUser.name} (${currentUser.email})\n`);
    } catch (error: any) {
        console.error(`Error logging in: ${error.message}`);
        return;
    }
    
    // Add friends
    console.log('=== Adding Friends ===');
    try {
        splitwiseSystem.addFriend('jane@example.com');
        console.log('Added Jane as a friend');
        
        splitwiseSystem.addFriend('bob@example.com');
        console.log('Added Bob as a friend');
        
        splitwiseSystem.addFriend('alice@example.com');
        console.log('Added Alice as a friend');
        
        const friends = splitwiseSystem.getFriends();
        console.log(`\nJohn now has ${friends.length} friends:`);
        friends.forEach(friend => {
            console.log(`- ${friend.name} (${friend.email})`);
        });
    } catch (error: any) {
        console.error(`Error adding friends: ${error.message}`);
    }
    console.log();
    
    // Create a group
    console.log('=== Creating a Group ===');
    let apartmentGroup: any;
    try {
        apartmentGroup = splitwiseSystem.createGroup('Apartment Expenses', 'Expenses for our shared apartment');
        console.log(`Created group: ${apartmentGroup.name} (${apartmentGroup.id})`);
        
        // Add members to the group
        splitwiseSystem.addUserToGroup(apartmentGroup.id, 'jane@example.com');
        console.log('Added Jane to the group');
        
        splitwiseSystem.addUserToGroup(apartmentGroup.id, 'bob@example.com');
        console.log('Added Bob to the group');
        
        console.log(`\nGroup now has ${apartmentGroup.getMemberCount()} members`);
    } catch (error: any) {
        console.error(`Error creating group: ${error.message}`);
    }
    console.log();
    
    // Create expenses
    console.log('=== Creating Expenses ===');
    
    // Get user IDs
    const allUsers = splitwiseSystem.getAllUsers();
    const johnId = currentUser.id;
    const janeId = allUsers.find(user => user.email === 'jane@example.com')?.id;
    const bobId = allUsers.find(user => user.email === 'bob@example.com')?.id;
    const aliceId = allUsers.find(user => user.email === 'alice@example.com')?.id;
    
    if (!janeId || !bobId || !aliceId) {
        console.error('Could not find all user IDs');
        return;
    }
    
    // Create a group expense
    try {
        if (!apartmentGroup) {
            console.log('Apartment group was not created successfully, skipping group expense');
        } else {
            const rentExpense = splitwiseSystem.createExpense(
                'Monthly Rent',
                1500,
                johnId,
                [johnId, janeId, bobId],
                SplitType.EQUAL,
                ExpenseCategory.RENT,
                apartmentGroup.id,
                'Rent for June 2023'
            );
            
            console.log(`Created group expense: ${rentExpense.description} ($${rentExpense.amount})`);
            console.log('Splits:');
            rentExpense.splits.forEach((amount, userId) => {
                const user = allUsers.find(u => u.id === userId);
                console.log(`- ${user?.name}: $${amount.toFixed(2)}`);
            });
        }
    } catch (error: any) {
        console.error(`Error creating group expense: ${error.message}`);
    }
    
    // Create a non-group expense
    try {
        const dinnerExpense = splitwiseSystem.createExpense(
            'Dinner at Italian Restaurant',
            200,
            johnId,
            [johnId, janeId, aliceId],
            SplitType.EQUAL,
            ExpenseCategory.FOOD
        );
        
        console.log(`\nCreated non-group expense: ${dinnerExpense.description} ($${dinnerExpense.amount})`);
        console.log('Splits:');
        dinnerExpense.splits.forEach((amount, userId) => {
            const user = allUsers.find(u => u.id === userId);
            console.log(`- ${user?.name}: $${amount.toFixed(2)}`);
        });
    } catch (error: any) {
        console.error(`Error creating non-group expense: ${error.message}`);
    }
    console.log();
    
    // Login as Jane
    try {
        currentUser = splitwiseSystem.login('jane@example.com', 'password123');
        console.log(`Logged in as: ${currentUser.name} (${currentUser.email})\n`);
    } catch (error: any) {
        console.error(`Error logging in: ${error.message}`);
        return;
    }
    
    // Create another expense
    try {
        if (!apartmentGroup) {
            console.log('Apartment group was not created successfully, skipping group expense');
        } else {
            const groceryExpense = splitwiseSystem.createExpense(
                'Grocery Shopping',
                120,
                janeId,
                [johnId, janeId, bobId],
                SplitType.EQUAL,
                ExpenseCategory.FOOD,
                apartmentGroup.id,
                'Weekly groceries'
            );
            
            console.log(`Created group expense: ${groceryExpense.description} ($${groceryExpense.amount})`);
            console.log('Splits:');
            groceryExpense.splits.forEach((amount, userId) => {
                const user = allUsers.find(u => u.id === userId);
                console.log(`- ${user?.name}: $${amount.toFixed(2)}`);
            });
        }
    } catch (error: any) {
        console.error(`Error creating group expense: ${error.message}`);
    }
    console.log();
    
    // Check balances
    console.log('=== Checking Balances ===');
    try {
        const balances = splitwiseSystem.getUserBalances();
        console.log(`${currentUser.name}'s balances:`);
        balances.forEach(({ user, balance }) => {
            console.log(`- ${user.name}: ${balance >= 0 ? 'owes you' : 'you owe'} $${Math.abs(balance).toFixed(2)}`);
        });
        
        const totalBalance = splitwiseSystem.getTotalBalance();
        console.log(`\nTotal balance: ${totalBalance >= 0 ? 'You are owed' : 'You owe'} $${Math.abs(totalBalance).toFixed(2)}`);
    } catch (error: any) {
        console.error(`Error checking balances: ${error.message}`);
    }
    console.log();
    
    // Login as Bob
    try {
        currentUser = splitwiseSystem.login('bob@example.com', 'password123');
        console.log(`Logged in as: ${currentUser.name} (${currentUser.email})\n`);
    } catch (error: any) {
        console.error(`Error logging in: ${error.message}`);
        return;
    }
    
    // Create a settlement
    console.log('=== Creating a Settlement ===');
    let settlement;
    try {
        const balances = splitwiseSystem.getUserBalances();
        const johnBalance = balances.find(b => b.user.id === johnId);
        
        if (johnBalance && johnBalance.balance < 0) {
            settlement = splitwiseSystem.createSettlement(
                bobId,
                johnId,
                Math.abs(johnBalance.balance),
                SettlementMethod.BANK_TRANSFER,
                'Paying my share of rent and groceries'
            );
            
            console.log(`Created settlement: Bob pays John $${settlement.amount.toFixed(2)}`);
        } else {
            console.log('No negative balance with John to settle');
        }
    } catch (error: any) {
        console.error(`Error creating settlement: ${error.message}`);
    }
    console.log();
    
    // Complete the settlement
    if (settlement) {
        console.log('=== Completing the Settlement ===');
        try {
            splitwiseSystem.completeSettlement(settlement.id, SettlementMethod.BANK_TRANSFER);
            console.log('Settlement completed successfully');
            
            // Check updated balances
            const updatedBalances = splitwiseSystem.getUserBalances();
            console.log(`\n${currentUser.name}'s updated balances:`);
            updatedBalances.forEach(({ user, balance }) => {
                console.log(`- ${user.name}: ${balance >= 0 ? 'owes you' : 'you owe'} $${Math.abs(balance).toFixed(2)}`);
            });
        } catch (error: any) {
            console.error(`Error completing settlement: ${error.message}`);
        }
        console.log();
    }
    
    // Simplify debts
    console.log('=== Simplifying Debts ===');
    try {
        const simplifiedDebts = splitwiseSystem.simplifyDebts();
        console.log('Simplified debts:');
        simplifiedDebts.forEach(({ from, to, amount }) => {
            console.log(`- ${from.name} owes ${to.name} $${amount.toFixed(2)}`);
        });
    } catch (error: any) {
        console.error(`Error simplifying debts: ${error.message}`);
    }
    
    console.log('\n=== Demo Completed ===');
}

// Run the demo
runDemo().catch(error => {
    console.error('Demo failed with error:', error);
}); 