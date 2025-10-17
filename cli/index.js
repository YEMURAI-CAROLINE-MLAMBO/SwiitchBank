#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { getToken, saveToken, clearToken } from './lib/auth.js';
import { getAccounts, getAccountInfo, getTransactions, getBalance, login, register } from './lib/api.js';

const program = new Command();

program
  .name('switchbank')
  .description('A CLI for interacting with the SwiitchBank API')
  .version('0.1.0');

program.command('status')
  .description('Check login status and user info')
  .action(async () => {
    const token = await getToken();
    if (token) {
      console.log(chalk.green('Status: Logged in. (Mocked)'));
    } else {
      console.log(chalk.yellow('Status: Not logged in.'));
      console.log(chalk.blue('Run `switchbank login` to get started.'));
    }
  });

program.command('register')
  .description('Register a new user')
  .option('-f, --firstName <firstName>', 'First name')
  .option('-l, --lastName <lastName>', 'Last name')
  .option('-e, --email <email>', 'User email')
  .option('-p, --password <password>', 'User password')
  .action(async (options) => {
    let { firstName, lastName, email, password } = options;

    if (!firstName || !lastName || !email || !password) {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'firstName', message: 'First Name:' },
            { type: 'input', name: 'lastName', message: 'Last Name:' },
            { type: 'input', name: 'email', message: 'Email:' },
            { type: 'password', name: 'password', message: 'Password:' },
        ]);
        firstName = answers.firstName;
        lastName = answers.lastName;
        email = answers.email;
        password = answers.password;
    }

    try {
        const result = await register(firstName, lastName, email, password);
        console.log(chalk.green(result.msg));
    } catch (error) {
        console.error(chalk.red('Registration failed:'), error.message);
    }
});

program.command('login')
  .description('Log in to SwiitchBank')
  .option('-e, --email <email>', 'User email')
  .option('-p, --password <password>', 'User password')
  .action(async (options) => {
    let { email, password } = options;

    if (!email || !password) {
      const answers = await inquirer.prompt([
        { type: 'input', name: 'email', message: 'Enter your email:', default: 'test@example.com' },
        { type: 'password', name: 'password', message: 'Enter your password:', default: 'password123' },
      ]);
      email = answers.email;
      password = answers.password;
    }

    try {
        const { token } = await login(email, password);
        await saveToken(token);
        console.log(chalk.green('Login successful!'));
    } catch (error) {
        console.error(chalk.red('Login failed:'), error.message);
    }
  });

program.command('logout')
    .description('Log out of SwiitchBank')
    .action(async () => {
        await clearToken();
        console.log(chalk.green('Logged out successfully.'));
    });

const accounts = program.command('accounts').description('Manage accounts');

accounts
  .command('list')
  .description('List all your accounts')
  .action(async () => {
    const token = await getToken();
    if (!token) {
      console.error(chalk.red('You must be logged in.'));
      return;
    }
    try {
      const accounts = await getAccounts(token);
      console.table(accounts);
    } catch (error) {
      console.error(chalk.red('Error fetching accounts:'), error.message);
    }
  });

accounts
    .command('info <accountId>')
    .description('Get detailed information for a specific account')
    .action(async (accountId) => {
        const token = await getToken();
        if (!token) {
            console.error(chalk.red('You must be logged in to perform this action.'));
            return;
        }
        try {
            const account = await getAccountInfo(token, accountId);
            console.log(account);
        } catch (error) {
            console.error(chalk.red(error.message));
        }
    });

program.command('balance')
    .description('Check account balance(s)')
    .argument('[accountId]', 'Optional account ID')
    .action(async (accountId) => {
        const token = await getToken();
        if (!token) {
            console.error(chalk.red('You must be logged in.'));
            return;
        }
        try {
            const balances = await getBalance(token, accountId);
            if (Array.isArray(balances)) {
                console.table(balances);
            } else {
                console.log(balances);
            }
        } catch (error) {
            console.error(chalk.red('Error fetching balance:'), error.message);
        }
    });

program.command('transactions')
    .description('List transactions')
    .argument('[accountId]', 'Optional account ID')
    .action(async (accountId) => {
        const token = await getToken();
        if (!token) {
            console.error(chalk.red('You must be logged in.'));
            return;
        }
        try {
            const transactions = await getTransactions(token, accountId);
            console.table(transactions);
        } catch (error) {
            console.error(chalk.red('Error fetching transactions:'), error.message);
        }
    });

program.parse(process.argv);